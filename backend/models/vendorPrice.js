// models/vendorPrice.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const VendorPrice = sequelize.define('VendorPrice', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    vendor_listing_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    effective_from: { type: DataTypes.DATEONLY, allowNull: false }
}, {
    tableName: 'vendor_prices',
    timestamps: false,
    indexes: [{ fields: ['vendor_listing_id', 'effective_from'] }]
});

export default VendorPrice;
