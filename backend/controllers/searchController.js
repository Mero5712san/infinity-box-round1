// controllers/searchController.js
import { Product, ProductVariant, VariantAttribute, AttributeDef, VendorListing, VendorPrice } from '../models/index.js';
import { Op } from 'sequelize';

// GET /search/variants?product=PLT&color=white&size=6
export const searchVariants = async (req, res) => {
    const { q = '', product_code, color, size } = req.query;
    try {
        const whereProduct = {};
        if (product_code) whereProduct.product_code = product_code;
        if (q) whereProduct[Op.or] = [{ name: { [Op.like]: `%${q}%` } }, { product_code: { [Op.like]: `%${q}%` } }];

        const attrIncludes = [];
        if (color) {
            attrIncludes.push({
                model: VariantAttribute,
                required: true,
                include: [{ model: AttributeDef, where: { name: 'color' } }],
                where: { value_text: color }
            });
        }
        if (size) {
            attrIncludes.push({
                model: VariantAttribute,
                required: true,
                include: [{ model: AttributeDef, where: { name: { [Op.in]: ['diameter_in', 'volume_ml'] } } }],
                where: { value_text: size }
            });
        }

        const variants = await ProductVariant.findAll({
            include: [
                { model: Product, where: whereProduct },
                ...attrIncludes,
                { model: VendorListing, include: [{ model: VendorPrice }], required: false }
            ]
        });

        res.json(variants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
