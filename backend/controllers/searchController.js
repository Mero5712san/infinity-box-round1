// controllers/searchController.js
import { Product, ProductVariant, VariantAttribute, AttributeDef, VendorListing, VendorPrice } from '../models/index.js';
import { Op } from 'sequelize';

export const searchVariants = async (req, res) => {
    const { q = "", product_code, color, size } = req.query;

    try {
        // Fetch all variants with Product included
        const variants = await ProductVariant.findAll({
            include: [{ model: Product }],
        });

        // Filter in JS
        const filtered = variants.filter((v) => {
            let match = true;

            // Product name/code filter
            if (q && !v.Product.name.toLowerCase().includes(q.toLowerCase()) &&
                !v.Product.product_code.toLowerCase().includes(q.toLowerCase())) {
                match = false;
            }

            if (product_code && v.Product.product_code.toLowerCase() !== product_code.toLowerCase()) {
                match = false;
            }

            // Attributes filter
            let attributes = {};
            if (v.attributes_json) {
                try {
                    attributes = JSON.parse(v.attributes_json);
                } catch (e) { }
            }

            if (color && attributes.color?.toLowerCase() !== color.toLowerCase()) match = false;
            if (size && !(attributes.diameter_in == size || attributes.volume_ml == size)) match = false;

            return match;
        });

        res.json(filtered);
    } catch (err) {
        console.error("searchVariants error:", err);
        res.status(500).json({ error: "Search failed" });
    }
};

