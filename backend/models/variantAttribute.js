// models/variantAttribute.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const VariantAttribute = sequelize.define('VariantAttribute', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    variant_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    attribute_def_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    value_text: { type: DataTypes.STRING(120), allowNull: false }
}, {
    tableName: 'variant_attributes',
    timestamps: false,
    indexes: [
        { unique: true, fields: ['variant_id', 'attribute_def_id'] },
        { fields: ['attribute_def_id', 'value_text'] }
    ]
});

export default VariantAttribute;
