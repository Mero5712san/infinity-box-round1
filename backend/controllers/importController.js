// controllers/importController.js
import csv from 'csv-parser';
import fs from 'fs';
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

export const importCSV = async (req, res) => {
    const entity = req.params.entity;
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'CSV file required' });

    const filePath = file.path;
    try {
        const rows = await parseCSV(filePath);
        let inserted = 0, updated = 0, errors = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            try {
                switch (entity) {
                    case 'categories': {
                        const [inst, created] = await Category.upsert({ name: row.name });
                        created ? inserted++ : updated++;
                        break;
                    }
                    case 'subcategories': {
                        const cat = await Category.findOne({ where: { name: row.category_name } });
                        if (!cat) throw new Error(`Category not found: ${row.category_name}`);
                        const [inst, created] = await Subcategory.upsert({ name: row.subcategory_name || row.name, category_id: cat.id });
                        created ? inserted++ : updated++;
                        break;
                    }
                    case 'products': {
                        const subcat = await Subcategory.findOne({ where: { name: row.subcategory_name } });
                        if (!subcat) throw new Error(`Subcategory not found: ${row.subcategory_name}`);
                        const [inst, created] = await Product.upsert({
                            product_code: row.product_code,
                            name: row.product_name,
                            description: row.description,
                            default_uom: row.default_uom || 'unit',
                            subcategory_id: subcat.id
                        });
                        created ? inserted++ : updated++;
                        break;
                    }
                    case 'attribute_defs': {
                        const [inst, created] = await AttributeDef.upsert({ name: row.name, value_type: row.value_type || 'text' });
                        created ? inserted++ : updated++;
                        break;
                    }
                    case 'product_variants': {
                        const prod = await Product.findOne({ where: { product_code: row.product_code } });
                        if (!prod) throw new Error(`Product not found: ${row.product_code}`);
                        await ProductVariant.upsert({ variant_sku: row.variant_sku, product_id: prod.id });
                        const variant = await ProductVariant.findOne({ where: { variant_sku: row.variant_sku } });
                        if (!variant) throw new Error(`Variant creation failed: ${row.variant_sku}`);
                        if (row.attributes_json) {
                            let attrs;
                            try { attrs = JSON.parse(row.attributes_json); } catch (e) { throw new Error('Invalid attributes_json'); }
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
                        let contact = {};
                        try { contact = row.contact_info ? JSON.parse(row.contact_info) : {}; } catch (e) { contact = {}; }
                        const [inst, created] = await Vendor.upsert({
                            vendor_code: row.vendor_code,
                            name: row.name,
                            gstin: row.gstin || null,
                            contact_info: contact,
                            rating: row.rating ? parseFloat(row.rating) : null,
                            active: String(row.active).toLowerCase() === 'true'
                        });
                        created ? inserted++ : updated++;
                        break;
                    }
                    case 'vendor_listings': {
                        const variant = await ProductVariant.findOne({ where: { variant_sku: row.variant_sku } });
                        const vendor = await Vendor.findOne({ where: { vendor_code: row.vendor_code } });
                        if (!variant) throw new Error(`Variant not found: ${row.variant_sku}`);
                        if (!vendor) throw new Error(`Vendor not found: ${row.vendor_code}`);
                        const [inst, created] = await VendorListing.upsert({
                            variant_id: variant.id,
                            vendor_id: vendor.id,
                            vendor_sku: row.vendor_sku,
                            pack_size: parseFloat(row.pack_size),
                            currency: row.currency || 'INR',
                            min_order_qty: row.min_order_qty ? parseInt(row.min_order_qty) : 0,
                            lead_time_days: row.lead_time_days ? parseInt(row.lead_time_days) : 0
                        });
                        created ? inserted++ : updated++;
                        break;
                    }
                    case 'vendor_prices': {
                        const vendor = await Vendor.findOne({ where: { vendor_code: row.vendor_code } });
                        if (!vendor) throw new Error(`Vendor not found: ${row.vendor_code}`);
                        const listing = await VendorListing.findOne({ where: { vendor_id: vendor.id, vendor_sku: row.vendor_sku } });
                        if (!listing) throw new Error(`Listing not found for ${row.vendor_sku}`);
                        const priceVal = parseFloat(row.price);
                        if (!priceVal || priceVal <= 0) throw new Error('Invalid price');
                        if (!row.effective_from) throw new Error('effective_from required');
                        await VendorPrice.create({ vendor_listing_id: listing.id, price: priceVal, effective_from: row.effective_from });
                        inserted++;
                        break;
                    }
                    case 'product_photos': {
                        const prod = await Product.findOne({ where: { product_code: row.product_code } });
                        if (!prod) throw new Error(`Product not found: ${row.product_code}`);
                        const [inst, created] = await ProductPhoto.upsert({
                            product_id: prod.id,
                            url: row.url,
                            is_primary: String(row.is_primary).toLowerCase() === 'true',
                            alt_text: row.alt_text || null
                        });
                        created ? inserted++ : updated++;
                        break;
                    }
                    case 'variant_photos': {
                        const variant = await ProductVariant.findOne({ where: { variant_sku: row.variant_sku } });
                        if (!variant) throw new Error(`Variant not found: ${row.variant_sku}`);
                        const [inst, created] = await VariantPhoto.upsert({
                            variant_id: variant.id,
                            url: row.url,
                            is_primary: String(row.is_primary).toLowerCase() === 'true',
                            alt_text: row.alt_text || null
                        });
                        created ? inserted++ : updated++;
                        break;
                    }
                    default:
                        throw new Error('Unknown entity for import');
                }
            } catch (err) {
                errors.push({ rowNumber: i + 1, msg: err.message, row });
            }
        }

        try { fs.unlinkSync(filePath); } catch (e) { /* ignore cleanup errors */ }
        return res.json({ inserted, updated, errors });
    } catch (err) {
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
        return res.status(500).json({ error: err.message });
    }
};
