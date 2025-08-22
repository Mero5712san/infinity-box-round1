// models/vendor.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Vendor = sequelize.define('Vendor', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    vendor_code: { type: DataTypes.STRING(32), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(180), allowNull: false },
    gstin: { type: DataTypes.STRING(20) },
    contact_info: { type: DataTypes.JSON },
    rating: { type: DataTypes.DECIMAL(3, 2) },
    active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    tableName: 'vendors',
    timestamps: false
});

export default Vendor;
