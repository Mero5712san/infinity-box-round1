// controllers/vendorController.js
import { Vendor } from '../models/index.js';

export const getAllVendors = async (req, res) => {
    try {
        const v = await Vendor.findAll();
        res.json(v);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createVendor = async (req, res) => {
    try {
        const { vendor_code, name, gstin, contact_info, rating, active } = req.body;
        if (!vendor_code || !name) return res.status(400).json({ error: 'vendor_code and name required' });
        const vendor = await Vendor.create({ vendor_code, name, gstin, contact_info, rating, active });
        res.status(201).json(vendor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
