/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";

const AddEditProductPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState<any>(null);
    const [subcategories, setSubcategories] = useState<any[]>([]);

    // Fetch subcategories for dropdown
    useEffect(() => {
        async function fetchSubcats() {
            try {
                const res = await fetch("http://localhost:5000/api/subcategories");
                const data = await res.json();
                console.log(" subcategories", data);
                setSubcategories(data);
            } catch (err) {
                console.error("Failed to fetch subcategories", err);
            }
        }
        fetchSubcats();
    }, []);

    // Fetch product if editing
    useEffect(() => {
        if (id) {
            async function fetchProduct() {
                try {
                    const res = await fetch("http://localhost:5000/api/products");
                    const data = await res.json();
                    const product = data.find((p: any) => p.id === Number(id));
                    setInitialData(product);
                } catch (err) {
                    console.error("Failed to fetch product", err);
                }
            }
            fetchProduct();
        }
    }, [id]);

    const handleSubmit = async (data: any) => {
        try {
            if (id) {
                await fetch(`http://localhost:5000/api/products/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
            } else {
                await fetch("http://localhost:5000/api/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
            }
            // navigate("/");
        } catch (err) {
            console.error("Failed to save product", err);
            alert("Error saving product");
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
            <h2>{id ? "Edit Product" : "Add Product"}</h2>
            <ProductForm
                initialData={initialData}
                subcategories={subcategories}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default AddEditProductPage;
