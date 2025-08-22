import React from "react";
import { Link } from "react-router-dom";
import "./prodlist.css";
interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}

interface Props {
    products: Product[];
    onDelete: (id: number) => void;
}

const ProductList: React.FC<Props> = ({ products, onDelete }) => {
    return (
        <div className="table-container">
            <table className="product-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price ($)</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{(2)}</td>
                            <td>{p.description}</td>
                            <td className="actions">
                                <Link to={`/edit/${p.id}`} className="btn edit">Edit</Link>
                                <button onClick={() => onDelete(p.id)} className="btn delete">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
