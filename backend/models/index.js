// models/index.js
import { sequelize } from '../config/db.js';

import Category from './category.js';
import Subcategory from './subcategory.js';
import Product from './product.js';
import AttributeDef from './attributeDef.js';
import ProductVariant from './productVariant.js';
import VariantAttribute from './variantAttribute.js';
import Vendor from './vendor.js';
import VendorListing from './vendorListing.js';
import VendorPrice from './vendorPrice.js';
import ProductPhoto from './productPhoto.js';
import VariantPhoto from './variantPhoto.js';

// Associations
Category.hasMany(Subcategory, { foreignKey: 'category_id' });
Subcategory.belongsTo(Category, { foreignKey: 'category_id' });

Subcategory.hasMany(Product, { foreignKey: 'subcategory_id' });
Product.belongsTo(Subcategory, { foreignKey: 'subcategory_id' });

Product.hasMany(ProductVariant, { foreignKey: 'product_id' });
ProductVariant.belongsTo(Product, { foreignKey: 'product_id' });

ProductVariant.hasMany(VariantAttribute, { foreignKey: 'variant_id' });
VariantAttribute.belongsTo(ProductVariant, { foreignKey: 'variant_id' });

AttributeDef.hasMany(VariantAttribute, { foreignKey: 'attribute_def_id' });
VariantAttribute.belongsTo(AttributeDef, { foreignKey: 'attribute_def_id' });

ProductVariant.hasMany(VendorListing, { foreignKey: 'variant_id' });
VendorListing.belongsTo(ProductVariant, { foreignKey: 'variant_id' });

Vendor.hasMany(VendorListing, { foreignKey: 'vendor_id' });
VendorListing.belongsTo(Vendor, { foreignKey: 'vendor_id' });

VendorListing.hasMany(VendorPrice, { foreignKey: 'vendor_listing_id' });
VendorPrice.belongsTo(VendorListing, { foreignKey: 'vendor_listing_id' });

Product.hasMany(ProductPhoto, { foreignKey: 'product_id' });
ProductVariant.hasMany(VariantPhoto, { foreignKey: 'variant_id' });

export {
    sequelize,
    Category,
    Subcategory,
    Product,
    AttributeDef,
    ProductVariant,
    VariantAttribute,
    Vendor,
    VendorListing,
    VendorPrice,
    ProductPhoto,
    VariantPhoto
};

export const initDB = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('All models synced');
    } catch (err) {
        console.error('Failed to sync models:', err);
        throw err;
    }
};
