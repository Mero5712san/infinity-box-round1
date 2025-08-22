// controllers/variantController.js
import { VendorListing, Vendor, VendorPrice, ProductVariant } from '../models/index.js';
import { Op } from 'sequelize';

// GET /variants/:id/vendors
export const getVariantVendors = async (req, res) => {
    const { id } = req.params;
    try {
        const listings = await VendorListing.findAll({
            where: { variant_id: id },
            include: [{ model: Vendor }, { model: VendorPrice, required: false }]
        });

        const vendors = listings.map(l => {
            const prices = (l.VendorPrices || []).filter(p => new Date(p.effective_from) <= new Date());
            const latest = prices.sort((a, b) => new Date(b.effective_from) - new Date(a.effective_from))[0] || null;
            const price = latest ? parseFloat(latest.price) : null;
            const pack = parseFloat(l.pack_size);
            return {
                vendor_id: l.Vendor?.id || null,
                vendor_name: l.Vendor?.name || null,
                vendor_sku: l.vendor_sku || null,
                price,
                pack_size: pack || null,
                price_per_unit: price && pack ? price / pack : null,
                min_order_qty: l.min_order_qty,
                lead_time_days: l.lead_time_days
            };
        }).sort((a, b) => (a.price_per_unit ?? Number.POSITIVE_INFINITY) - (b.price_per_unit ?? Number.POSITIVE_INFINITY));

        res.json(vendors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
