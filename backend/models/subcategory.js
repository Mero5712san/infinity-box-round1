// models/subcategory.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Subcategory = sequelize.define('Subcategory', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    category_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    name: { type: DataTypes.STRING(120), allowNull: false }
}, {
    tableName: 'subcategories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [{ unique: true, fields: ['category_id', 'name'] }]
});

export default Subcategory;
