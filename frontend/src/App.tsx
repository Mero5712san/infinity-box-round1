import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/navBar";
import ProductPage from "./pages/ProductPage";
import AddEditProductPage from "./pages/AddEditProductPage";
import Upload from "./pages/upload";
import VariantDetail from "./components/VariantDetail";
import Dashboard from "./pages/dashboard";
import "./App.css"
const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/add" element={<AddEditProductPage />} />
          <Route path="/edit/:id" element={<AddEditProductPage />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/photoupload" element={<VariantDetail variantId={1} productId={1} />} />
        </Routes>
      </div>

      {/* Floating + button */}
      <Link to="/upload" className="fab">
        +
      </Link>
    </div>
  );
};

export default App;
