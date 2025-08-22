// models/attributeDef.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const AttributeDef = sequelize.define('AttributeDef', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(64), allowNull: false, unique: true },
    value_type: { type: DataTypes.ENUM('text', 'number'), defaultValue: 'text' }
}, {
    tableName: 'attribute_defs',
    timestamps: false
});

export default AttributeDef;
