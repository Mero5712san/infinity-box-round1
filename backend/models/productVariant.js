// models/productVariant.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const ProductVariant = sequelize.define('ProductVariant', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    product_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    variant_sku: { type: DataTypes.STRING(64), allowNull: false, unique: true }
}, {
    tableName: 'product_variants',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default ProductVariant;
