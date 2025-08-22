Project Overview

This dashboard allows non-technical staff to manage products, variants, vendors, and pricing efficiently.

Upload, edit, and search products with multiple attributes (color, size, volume).

Supports multiple vendors per variant, each with its own SKU, pack size, MOQ, lead time, and price history.

Automatically surfaces the cheapest vendor per variant.

Photo mapping at product and variant levels (variant photos override product photos).

Performance Goals:

Import ≥100 products with variants in ≤30 minutes via CSV.

Search results return in <2 seconds for typical queries.

Each product supports ≥3 colors × ≥5 sizes × ≥10 vendors.

Tech Stack

Backend: Node.js + Express, Sequelize ORM

Database: MySQL 8.x (normalized schema)

Frontend: React.js (with Chart.js for dashboard charts)

Storage: Local storage for images (URLs stored in DB)

Optional: Redis for caching (not implemented for MVP)

Setup Instructions

Clone the repo:

git clone https://github.com/<username>/product-dashboard.git
cd product-dashboard


Backend Setup:

cd backend
npm install
# Create .env with DB credentials and ADMIN_TOKEN
npm run dev


Frontend Setup:

cd frontend
npm install
npm start


Database:

Run the SQL scripts in /db/schema.sql to create tables.

Import sample CSVs from /samples using /api/import/:entity endpoints.

Optional Docker:

Backend: docker build -t dashboard-backend .

Frontend: docker build -t dashboard-frontend .

Run containers and link networks for full setup.

Database Schema & ERD

Normalized schema highlights:

categories → subcategories → products → product_variants → variant_attributes

vendors → vendor_listings → vendor_prices (variant-level pricing)

Photos: product_photos, variant_photos, optional vendor_listing_photos

ERD:

(include your ERD image here)

Key Design Decisions:

Variant-level vendor mapping ensures accurate procurement decisions.

Historical prices separated in vendor_prices for audit and analytics.

Indexed attributes and variant/vendor fields for fast search and cheapest vendor queries.

CSV Import & Sample Data

Entities: categories, subcategories, products, attribute_defs, product_variants, variant_attributes, vendors, vendor_listings, vendor_prices, product_photos, variant_photos.

Sample CSVs: Provided in /samples reproducing the Plate and Bowl example exactly.

Idempotency: Re-importing the same CSV updates existing rows without creating duplicates.

Validation: Reject rows with invalid pack_size or price, return detailed row-level error messages.

API Endpoints

GET /products?search=&subcategory=&limit=&offset=

GET /products/:id/variants

GET /variants/:id/vendors → returns vendors with current price and price/unit (asc)

POST /import/:entity → CSV upload, returns { inserted, updated, errors:[{row,msg}] }

POST /upload/photo → upload file, returns { url }

UI & Features

Upload Center: Preview, validate, and upsert CSV data.

CRUD: Categories, Subcategories, Products, Variants, Vendors, Vendor Listings, Prices, Photos.

Variant Detail Page: Shows attributes, primary photo, vendors sorted by current price/unit, price history.

Search: Free-text across product name/code, variant SKU, vendor name/SKU with attribute filters.

Dashboard Charts: Products per Category, Variants per Vendor, Total counts.

Validation Rules

Unique keys: product_code, variant_sku, vendor_code, (variant_id, vendor_id).

Price > 0, pack_size > 0.

Current price only counts rows with effective_from ≤ today.

Idempotent CSV import.

AI Usage Log

Tools Used: ChatGPT + GitHub Copilot for scaffolding backend routes, generating sample CSVs, and frontend components.

Purpose: Accelerate code generation, ERD drafting, and CSV templates.

Validation: Manually tested each CSV import, search, and cheapest vendor calculation. Did not blindly copy AI output; validated queries and frontend display.

Assumptions & Trade-offs

Product-level default vendor table not implemented (variant-level covers requirement).

Images stored locally instead of S3 for MVP.

Auth is a single admin token; RBAC can be added for production.

Performance acceptable for ≤500 products with multiple variants/vendors; Redis caching optional for larger scale.

Demo Walkthrough

Step 1: Import CSVs → check console summary.

Step 2: Search Product → Color → Size → verify correct variant and vendors.

Step 3: Open Variant Detail → primary photo, vendors sorted by price/unit, price history.

Step 4: Re-import CSV → verify upserts, no duplicates.

Step 5: Upload new photos → variant photo overrides product photo.
