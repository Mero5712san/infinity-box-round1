// controllers/productController.js
import { Product, Subcategory, ProductVariant, VariantAttribute, AttributeDef, ProductPhoto } from '../models/index.js';
import { Op } from 'sequelize';

export const getProducts = async (req, res) => {
    const { search = '', subcategory, limit = 20, offset = 0 } = req.query;
    try {
        const where = {};
        if (subcategory) {
            const sub = await Subcategory.findOne({ where: { name: subcategory } });
            if (sub) where.subcategory_id = sub.id;
        }
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { product_code: { [Op.like]: `%${search}%` } }
            ];
        }
        const products = await Product.findAll({
            where,
            include: [{ model: ProductPhoto }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['name', 'ASC']]
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getProductVariants = async (req, res) => {
    const { id } = req.params;
    try {
        const variants = await ProductVariant.findAll({
            where: { product_id: id },
            include: [{ model: VariantAttribute, include: [AttributeDef] }]
        });
        res.json(variants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { subcategory_id, product_code, name, description, default_uom } = req.body;
        if (!subcategory_id || !product_code || !name) return res.status(400).json({ error: 'subcategory_id, product_code, name required' });
        const sub = await Subcategory.findByPk(subcategory_id);
        if (!sub) return res.status(404).json({ error: 'Subcategory not found' });
        const product = await Product.create({ subcategory_id, product_code, name, description, default_uom });
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const p = await Product.findByPk(req.params.id, { include: [ProductPhoto, ProductVariant] });
        if (!p) return res.status(404).json({ error: 'Product not found' });
        res.json(p);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        const updates = (({ subcategory_id, product_code, name, description, default_uom }) => ({ subcategory_id, product_code, name, description, default_uom }))(req.body);
        await product.update(updates);
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const p = await Product.findByPk(req.params.id);
        if (!p) return res.status(404).json({ error: 'Product not found' });
        await p.destroy();
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
