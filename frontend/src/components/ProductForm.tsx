import React, { useState, useEffect } from "react";
import "./prodform.css"
import { useNavigate } from "react-router-dom";
interface ProductFormProps {
    initialData?: any;
    subcategories: { id: number; name: string }[];
    onSubmit: (data: any) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, subcategories, onSubmit }) => {
    const [form, setForm] = useState({
        product_code: "",
        name: "",
        description: "",
        default_uom: "unit",
        subcategory_id: subcategories.length > 0 ? subcategories[0].id : null,
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (initialData) setForm(initialData);
    }, [initialData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name === "subcategory_id" ? Number(value) : value, // ✅ convert ID to number
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.subcategory_id === null || !form.product_code.trim() || !form.name.trim()) {
            alert("Subcategory, product code and name are required");
            return;
        }
        onSubmit(form);
        setForm({
            product_code: "",
            name: "",
            description: "",
            default_uom: "unit",
            subcategory_id: subcategories.length > 0 ? subcategories[0].id : 0,
        });
        navigate("/products");
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Subcategory</label>
                <select
                    name="subcategory_id"
                    value={form.subcategory_id}
                    onChange={handleChange}
                    required
                >
                    {subcategories.map((sc) => (
                        <option key={sc.id} value={sc.id}>
                            {sc.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Product Code</label>
                <input
                    name="product_code"
                    value={form.product_code}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Name</label>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                />
            </div>


            <button type="submit" className="btn-submit">
                Save
            </button>
        </form>
    );
};

export default ProductForm;
