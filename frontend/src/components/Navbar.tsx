import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <Link to="/" className="logo">Product Dashboard</Link>
            <div className="nav-links">
                <Link to="/products" className="nav-link">Products</Link>
                <Link to="/add" className="nav-link">Add Product</Link>
            </div>
        </nav>
    );
};

export default Navbar;
