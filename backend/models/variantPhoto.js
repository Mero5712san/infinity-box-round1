// models/variantPhoto.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const VariantPhoto = sequelize.define('VariantPhoto', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    variant_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    url: { type: DataTypes.STRING(512), allowNull: false },
    is_primary: { type: DataTypes.BOOLEAN, defaultValue: false },
    alt_text: { type: DataTypes.STRING(160) }
}, {
    tableName: 'variant_photos',
    timestamps: false
});

export default VariantPhoto;
