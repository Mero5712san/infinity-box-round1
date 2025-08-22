import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./Dashboard.css";

export default function Dashboard() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [vendorCounts, setVendorCounts] = useState({});
    const [variantVendorCounts, setVariantVendorCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch categories, products, vendors in parallel
                const [catRes, prodRes, vendRes] = await Promise.all([
                    fetch("http://localhost:5000/api/categories"),
                    fetch("http://localhost:5000/api/products"),
                    fetch("http://localhost:5000/api/vendors"),
                ]);

                const cats = await catRes.json();
                const prods = await prodRes.json();
                const vends = await vendRes.json();

                setCategories(cats);
                setProducts(prods);
                setVendors(vends);

                // Initialize vendor count per vendor
                const counts: Record<string, number> = {};
                for (const v of vends) counts[v.name] = 0;

                // Fetch all variants for all products in parallel
                const variantResponses = await Promise.all(
                    prods.map((prod) =>
                        fetch(`http://localhost:5000/api/products/${prod.id}/variants`, {
                            method: "GET",
                            headers: { "Cache-Control": "no-cache" },
                        }).then((res) => (res.ok ? res.json() : []))
                    )
                );

                const allVariants = variantResponses.flat();

                // Fetch vendors for all variants in parallel
                const vendorResponses = await Promise.all(
                    allVariants.map((v) =>
                        fetch(`http://localhost:5000/api/variants/${v.variant_sku}/vendors`, {
                            method: "GET",
                            headers: { "Cache-Control": "no-cache" },
                        }).then((res) => (res.ok ? res.json() : []))
                    )
                );

                const allVariantVendors = vendorResponses.flat();

                // Count vendors per vendor (old metric)
                for (const vv of allVariantVendors) {
                    if (vv.vendor_name && counts[vv.vendor_name] !== undefined) {
                        counts[vv.vendor_name] += 1;
                    }
                }
                setVendorCounts(counts);

                // Count vendors per variant (new metric)
                const variantCounts: Record<string, number> = {};
                allVariants.forEach((variant, idx) => {
                    const vendorsForVariant = vendorResponses[idx];
                    variantCounts[variant.variant_sku] = vendorsForVariant.length;
                });
                setVariantVendorCounts(variantCounts);

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            }
        }

        fetchData();
    }, []);

    // Products per Category Chart
    const categoryChartData = {
        labels: categories.map((c) => c.name),
        datasets: [
            {
                label: "Products per Category",
                data: categories.map((c) =>
                    products.filter((p) => p.subcategory_id === c.id).length
                ),
                backgroundColor: "rgba(75,192,192,0.6)",
            },
        ],
    };

    // Vendors per Variant Chart
    const variantChartData = {
        labels: Object.keys(variantVendorCounts),
        datasets: [
            {
                label: "Vendors per Variant",
                data: Object.values(variantVendorCounts),
                backgroundColor: "rgba(255, 159, 64, 0.6)",
            },
        ],
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Product Management Dashboard</h2>

            <div className="dashboard-stats">
                <div className="stat-card">
                    Total Categories: <span>{categories.length}</span>
                </div>
                <div className="stat-card">
                    Total Products: <span>{products.length}</span>
                </div>
                <div className="stat-card">
                    Total Vendors: <span>{vendors.length}</span>
                </div>
            </div>

            <div className="dashboard-charts">
                <div className="chart-card">
                    <h3>Products per Category</h3>
                    <Bar data={categoryChartData} />
                </div>
                <div className="chart-card">
                    <h3>Vendors per Variant</h3>
                    <Bar data={variantChartData} />
                </div>
            </div>

            <div className="dashboard-vendors">
                <h3>Vendors List</h3>
                <table className="vendor-table">
                    <thead>
                        <tr>
                            <th>Vendor Name</th>
                            <th>Total Variants</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map((v) => (
                            <tr key={v.id}>
                                <td>{v.name}</td>
                                <td>{vendorCounts[v.name] || 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
