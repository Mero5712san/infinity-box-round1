// controllers/importController.js
import csv from 'csv-parser';
import fs from 'fs';
import { Op } from 'sequelize';
import {
    Category, Subcategory, Product, AttributeDef, ProductVariant,
    VariantAttribute, Vendor, VendorListing, VendorPrice,
    ProductPhoto, VariantPhoto
} from '../models/index.js';

const parseCSV = filePath => new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', data => rows.push(data))
        .on('end', () => resolve(rows))
        .on('error', reject);
});

const safeJSON = (s) => {
    if (!s) return {};
    try { return JSON.parse(s); } catch { return {}; }
};

export const importCSV = async (req, res) => {
    const entity = req.params.entity;
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'CSV file required' });

    const filePath = file.path;
    try {
        const rows = await parseCSV(filePath);
        let inserted = 0, updated = 0;
        const errors = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            try {
                switch (entity) {
                    case 'categories': {
                        const [instance, created] = await Category.upsert({ name: row.name.trim() });
                        created ? inserted++ : updated++;
                        break;
                    }
                    case 'subcategories': {
                        if (!row.category_name) throw new Error('category_name required');
                        const cat = await Category.findOne({ where: { name: row.category_name.trim() } });
                        if (!cat) throw new Error(`Category not found: ${row.category_name}`);
                        const name = (row.subcategory_name || row.name || '').trim();
                        if (!name) throw new Error('subcategory_name required');
                        const [instance, created] = await Subcategory.upsert({ name, category_id: cat.id });
                        created ? inserted++ : updated++;
                        break;
                    }
                    case 'products': {
                        if (!row.subcategory_name) throw new Error('subcategory_name required');
                        const subcat = await Subcategory.findOne({ where: { name: row.subcategory_name.trim() } });
                        if (!subcat) throw new Error(`Subcategory not found: ${row.subcategory_name}`);
                        if (!row.product_code) throw new Error('product_code required');
                        const [instance, created] = await Product.upsert({
                            product_code: row.product_code.trim(),
                            name: (row.product_name || '').trim(),
                            description: row.description || null,
                            default_uom: row.default_uom || 'unit',
                            subcategory_id: subcat.id
                        });
                        created ? inserted++ : updated++;
                        break;
                    }
                    case 'attribute_defs': {
                        if (!row.name) throw new Error('attribute name required');
                        const [instance, created] = await AttributeDef.upsert({
                            name: row.name.trim(),
                            value_type: row.value_type && row.value_type.trim() === 'number' ? 'number' : 'text'
                        });
                        created ? inserted++ : updated++;
                        break;
                    }
                    case 'product_variants': {
                        if (!row.product_code) throw new Error('product_code required');
                        if (!row.variant_sku) throw new Error('variant_sku required');
                        const prod = await Product.findOne({ where: { product_code: row.product_code.trim() } });
                        if (!prod) throw new Error(`Product not found: ${row.product_code}`);
                        await ProductVariant.upsert({ variant_sku: row.variant_sku.trim(), product_id: prod.id });
                        const variant = await ProductVariant.findOne({ where: { variant_sku: row.variant_sku.trim() } });
                        if (!variant) throw new Error(`Failed to find/create variant: ${row.variant_sku}`);
                        if (row.attributes_json) {
                            let attrs;
                            try { attrs = JSON.parse(row.attributes_json); } catch (e) { throw new Error('attributes_json invalid JSON'); }
                            for (const [k, v] of Object.entries(attrs)) {
                                let def = await AttributeDef.findOne({ where: { name: k } });
                                if (!def) def = await AttributeDef.create({ name: k, value_type: typeof v === 'number' ? 'number' : 'text' });
                                await VariantAttribute.upsert({ variant_id: variant.id, attribute_def_id: def.id, value_text: String(v) });
                            }
                        }
                        inserted++;
                        break;
                    }
                    case 'vendors': {
                        if (!row.vendor_code) throw new Error('vendor_code required');
                        const contact = safeJSON(row.contact_info);
                        const [instance, created] = await Vendor.upsert({
                            vendor_code: row.vendor_code.trim(),
                            name: (row.name || '').trim(),
                            gstin: row.gstin || null,
                            contact_info: contact,
                            rating: row.rating ? parseFloat(row.rating) : null,
                            active: String(row.active).toLowerCase() === 'true'
                        });
                        created ? inserted++ : updated++;
                        break;
                    }
                    case 'vendor_listings': {
                        if (!row.variant_sku) throw new Error('variant_sku required');
                        if (!row.vendor_code) throw new Error('vendor_code required');
                        if (!row.pack_size) throw new Error('pack_size required');
                        const variant = await ProductVariant.findOne({ where: { variant_sku: row.variant_sku.trim() } });
                        const vendor = await Vendor.findOne({ where: { vendor_code: row.vendor_code.trim() } });
                        if (!variant) throw new Error(`Variant not found: ${row.variant_sku}`);
                        if (!vendor) throw new Error(`Vendor not found: ${row.vendor_code}`);
                        const pack_size = parseFloat(row.pack_size);
                        if (!isFinite(pack_size) || pack_size <= 0) throw new Error('pack_size must be > 0');
                        const vendorSku = (row.vendor_sku || '').trim();
                        const [inst, created] = await VendorListing.upsert({
                            variant_id: variant.id,
                            vendor_id: vendor.id,
                            vendor_sku: vendorSku,
                            pack_size: pack_size,
                            currency: row.currency || 'INR',
                            min_order_qty: row.min_order_qty ? parseInt(row.min_order_qty) : 0,
                            lead_time_days: row.lead_time_days ? parseInt(row.lead_time_days) : 0
                        });
                        created ? inserted++ : updated++;
                        break;
                    }
                    case 'vendor_prices': {
                        if (!row.vendor_code) throw new Error('vendor_code required');
                        if (!row.vendor_sku) throw new Error('vendor_sku required');
                        if (!row.price) throw new Error('price required');
                        if (!row.effective_from) throw new Error('effective_from required');
                        const vendor = await Vendor.findOne({ where: { vendor_code: row.vendor_code.trim() } });
                        if (!vendor) throw new Error(`Vendor not found: ${row.vendor_code}`);
                        const listing = await VendorListing.findOne({ where: { vendor_id: vendor.id, vendor_sku: row.vendor_sku.trim() } });
                        if (!listing) throw new Error(`Vendor listing not found for ${row.vendor_sku}`);
                        const price = parseFloat(row.price);
                        if (!isFinite(price) || price <= 0) throw new Error('price must be > 0');
                        await VendorPrice.create({ vendor_listing_id: listing.id, price, effective_from: row.effective_from });
                        inserted++;
                        break;
                    }
                    case 'product_photos': {
                        if (!row.product_code || !row.url) throw new Error('product_code and url required');
                        const prod = await Product.findOne({ where: { product_code: row.product_code.trim() } });
                        if (!prod) throw new Error(`Product not found: ${row.product_code}`);
                        const [inst, created] = await ProductPhoto.upsert({
                            product_id: prod.id,
                            url: row.url.trim(),
                            is_primary: String(row.is_primary).toLowerCase() === 'true',
                            alt_text: row.alt_text || null
                        });
                        created ? inserted++ : updated++;
                        break;
                    }
                    case 'variant_photos': {
                        if (!row.variant_sku || !row.url) throw new Error('variant_sku and url required');
                        const variant = await ProductVariant.findOne({ where: { variant_sku: row.variant_sku.trim() } });
                        if (!variant) throw new Error(`Variant not found: ${row.variant_sku}`);
                        const [inst, created] = await VariantPhoto.upsert({
                            variant_id: variant.id,
                            url: row.url.trim(),
                            is_primary: String(row.is_primary).toLowerCase() === 'true',
                            alt_text: row.alt_text || null
                        });
                        created ? inserted++ : updated++;
                        break;
                    }
                    default:
                        throw new Error(`Unknown import entity: ${entity}`);
                }
            } catch (err) {
                errors.push({ rowNumber: i + 1, row, msg: err.message });
            }
        } // end for

        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
        return res.json({ inserted, updated, errors });
    } catch (err) {
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
        return res.status(500).json({ error: err.message });
    }
};
