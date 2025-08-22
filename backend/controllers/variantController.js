import { sequelize } from '../models/index.js';
import { QueryTypes } from 'sequelize';

export const getVariantVendors = async (req, res) => {
    const variantSku = req.params.sku; // pass variant SKU like PLT-WHT-6IN
    if (!variantSku) return res.status(400).json({ error: 'variant SKU required' });

    try {
        const sql = `
            SELECT v.id AS vendor_id, v.vendor_code, v.name AS vendor_name,
                   vl.vendor_sku, vl.pack_size, vp.price, vp.effective_from
            FROM vendor_listings vl
            JOIN product_variants pv ON pv.id = vl.variant_id
            JOIN vendors v ON v.id = vl.vendor_id
            LEFT JOIN vendor_prices vp 
                ON vp.vendor_listing_id = vl.id
               AND vp.effective_from = (
                    SELECT MAX(vp2.effective_from)
                    FROM vendor_prices vp2
                    WHERE vp2.vendor_listing_id = vl.id AND vp2.effective_from <= CURDATE()
                )
            WHERE pv.variant_sku = :variant_sku
            ORDER BY vp.price ASC;
        `;

        const rows = await sequelize.query(sql, {
            replacements: { variant_sku: variantSku },
            type: QueryTypes.SELECT
        });

        const vendors = rows.map(r => ({
            vendor_id: r.vendor_id,
            vendor_code: r.vendor_code,
            vendor_name: r.vendor_name,
            vendor_sku: r.vendor_sku,
            pack_size: r.pack_size,
            price: r.price !== null ? parseFloat(r.price) : null
        }));

        res.json(vendors);
    } catch (err) {
        console.error('getVariantVendors error', err);
        res.status(500).json({ error: 'Failed to fetch vendors' });
    }
};
