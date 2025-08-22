// routes/index.js
import express from 'express';
import multer from 'multer';
import * as importCtrl from '../controllers/importController.js';
import * as photoCtrl from '../controllers/photoController.js';
import * as productCtrl from '../controllers/productController.js';
import * as variantCtrl from '../controllers/variantController.js';
import * as categoryCtrl from '../controllers/categoryController.js';
import * as subcatCtrl from '../controllers/subcategoryController.js';
import * as vendorCtrl from '../controllers/vendorController.js';
import * as searchCtrl from '../controllers/searchController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// import
router.post('/import/:entity', upload.single('file'), importCtrl.importCSV);

// photos
router.post('/upload/photo', photoCtrl.upload.single('photo'), photoCtrl.uploadPhoto);

// products
router.get('/products', productCtrl.getProducts);
router.get('/products/:id/variants', productCtrl.getProductVariants);
router.post('/products', productCtrl.createProduct);
router.get('/products/:id', productCtrl.getProductById);
router.put('/products/:id', productCtrl.updateProduct);
router.delete('/products/:id', productCtrl.deleteProduct);

// variants -> vendors/prices
router.get('/variants/:sku/vendors', variantCtrl.getVariantVendors);

// categories / subcategories / vendors
router.get('/categories', categoryCtrl.getAllCategories);
router.post('/categories', categoryCtrl.createCategory);
router.put('/categories/:id', categoryCtrl.updateCategory);
router.delete('/categories/:id', categoryCtrl.deleteCategory);

router.get('/subcategories', subcatCtrl.getAllSubcategories);
router.post('/subcategories', subcatCtrl.createSubcategory);

router.get('/vendors', vendorCtrl.getAllVendors);
router.post('/vendors', vendorCtrl.createVendor);

// search
router.get('/search/variants', searchCtrl.searchVariants);

export default router;
