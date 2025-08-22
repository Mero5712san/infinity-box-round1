// src/components/PhotoUpload.tsx
import React, { useState } from "react";

interface Props {
    productId?: number;   // optional: if uploading for product
    variantId?: number;   // optional: if uploading for variant
}

export default function PhotoUpload({ productId, variantId }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("⚠️ Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("photo", file);

        // attach meta info for backend
        if (productId) formData.append("product_id", String(productId));
        if (variantId) formData.append("variant_id", String(variantId));
        formData.append("is_primary", "true"); // default mark as primary

        try {
            const res = await fetch("http://localhost:5000/api/upload/photo", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                setMessage("✅ Photo uploaded successfully!");
            } else {
                const err = await res.json();
                setMessage(`❌ Upload failed: ${err.error || "Unknown error"}`);
            }
        } catch (err) {
            setMessage("⚠️ Error while uploading.");
        }
    };

    return (
        <div style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: 8 }}>
            <h3>Upload Photo</h3>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload} style={{ marginLeft: "1rem" }}>
                Upload
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}
