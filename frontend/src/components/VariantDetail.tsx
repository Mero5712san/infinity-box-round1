// src/components/PhotoUpload.tsx
import React, { useState } from "react";
import "./varientdetails.css";

interface Props {
    productId?: number;
    variantId?: number;
}

export default function PhotoUpload({ productId, variantId }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("⚠️ Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("photo", file);
        if (productId) formData.append("product_id", String(productId));
        if (variantId) formData.append("variant_id", String(variantId));
        formData.append("is_primary", "true");

        try {
            const res = await fetch("http://localhost:5000/api/upload/photo", {
                method: "POST",
                body: formData,
            });

            if (res.ok) setMessage("✅ Photo uploaded successfully!");
            else {
                const err = await res.json();
                setMessage(`❌ Upload failed: ${err.error || "Unknown error"}`);
            }
        } catch {
            setMessage("⚠️ Error while uploading.");
        }
    };

    return (
        <div className="photo-upload-card">
            <h3 className="photo-upload-title">Upload Photo</h3>

            {preview && <img src={preview} alt="preview" className="photo-upload-preview" />}

            <div className="photo-upload-file">
                <label className="file-label">
                    {file ? file.name : "Choose a photo"}
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </label>
            </div>

            <button onClick={handleUpload} className="photo-upload-btn">
                Upload
            </button>
            {message && <p className="photo-upload-message">{message}</p>}
        </div>
    );
}
