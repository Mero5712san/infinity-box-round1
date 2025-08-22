// controllers/subcategoryController.js
import { Subcategory, Category } from '../models/index.js';

export const getAllSubcategories = async (req, res) => {
    try {
        const subs = await Subcategory.findAll({ include: [Category] });
        res.json(subs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createSubcategory = async (req, res) => {
    try {
        const { name, category_id } = req.body;
        if (!name || !category_id) return res.status(400).json({ error: 'name and category_id required' });
        const cat = await Category.findByPk(category_id);
        if (!cat) return res.status(404).json({ error: 'Category not found' });
        const s = await Subcategory.create({ name, category_id });
        res.status(201).json(s);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
