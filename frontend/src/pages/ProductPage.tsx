/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import { fetchProducts, deleteProduct, searchProducts } from "../services/api";

const ProductPage: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);

    // Search fields
    const [q, setQ] = useState("");
    const [productCode, setProductCode] = useState("");
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");

    const loadProducts = async () => {
        const data = await fetchProducts();
        setProducts(data);
    };

    const handleDelete = async (id: number) => {
        await deleteProduct(id);
        loadProducts();
    };

    const handleSearch = async () => {
        if (!q && !productCode && !color && !size) {
            loadProducts();
        } else {
            const results = await searchProducts({ q, product_code: productCode, color, size });
            setProducts(results);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>Products</h2>

            {/* Search filters */}
            <div style={{ marginBottom: 15, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input type="text" placeholder="Search name/code..." value={q} onChange={e => setQ(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Product Code" value={productCode} onChange={e => setProductCode(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Color" value={color} onChange={e => setColor(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Size" value={size} onChange={e => setSize(e.target.value)} style={inputStyle} />
                <button onClick={handleSearch} style={btnStyle}>Search</button>
            </div>

            <ProductList products={products} onDelete={handleDelete} />
        </div>
    );
};

const inputStyle: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    width: 150
};

const btnStyle: React.CSSProperties = {
    padding: "8px 16px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: 6,
    cursor: "pointer"
};

export default ProductPage;
