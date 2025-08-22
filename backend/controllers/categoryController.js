// controllers/categoryController.js
import { Category } from '../models/index.js';

export const getAllCategories = async (req, res) => {
    try {
        const cats = await Category.findAll();
        res.json(cats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'name required' });
        const c = await Category.create({ name });
        res.status(201).json(c);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const c = await Category.findByPk(req.params.id);
        if (!c) return res.status(404).json({ error: 'Category not found' });
        await c.update({ name: req.body.name });
        res.json(c);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        await Category.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
