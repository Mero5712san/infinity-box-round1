// src/pages/Upload.tsx
import React, { useState } from "react";
import "./upload.css";

const Upload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("categories");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage(" Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(
                `http://localhost:5000/api/import/${type}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (response.ok) {
                setMessage(` File uploaded successfully to ${type}!`);
            } else {
                setMessage(" Upload failed. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setMessage(" Error while uploading");
        }
    };

    return (
        <div className="upload-container">
            <h2 className="upload-title">Upload CSV</h2>

            <div className="form-group">
                <label>Select type</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="categories">Categories</option>
                    <option value="subcategories">Subcategories</option>
                    <option value="products">Products</option>
                    <option value="attribute_defs">Attribute defs</option>
                    <option value="product_variants">Product variants</option>
                    <option value="vendors">Vendors</option>
                    <option value="vendor_listings">Vendor listings</option>
                    <option value="vendor_prices">Vendor prices</option>
                    <option value="product_photos">Product photos</option>
                    <option value="variant_photos">Variant photos</option>
                </select>
            </div>

            <div className="form-group">
                <label>Choose CSV File</label>
                <input type="file" accept=".csv" onChange={handleFileChange} className="upload-input" />
            </div>

            <button onClick={handleUpload} className="upload-btn">
                Upload
            </button>

            {message && <p className="upload-message">{message}</p>}
        </div>
    );
};

export default Upload;
