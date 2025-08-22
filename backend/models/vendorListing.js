// models/vendorListing.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const VendorListing = sequelize.define('VendorListing', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    variant_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    vendor_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    vendor_sku: { type: DataTypes.STRING(64) },
    pack_size: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.CHAR(3), defaultValue: 'INR' },
    min_order_qty: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
    lead_time_days: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 }
}, {
    tableName: 'vendor_listings',
    timestamps: false,
    indexes: [{ unique: true, fields: ['variant_id', 'vendor_id'] }]
});

export default VendorListing;
