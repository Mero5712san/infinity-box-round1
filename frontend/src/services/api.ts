/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = "http://localhost:5000/api/products";
const API_UR = "http://localhost:5000/api"; // adjust base URL

export async function fetchProducts() {
    const res = await fetch(`${API_UR}/products`);
    return res.json();
}

export async function searchProducts({
    q = "",
    product_code = "",
    color = "",
    size = ""
}: {
    q?: string;
    product_code?: string;
    color?: string;
    size?: string | number;
}) {
    const params = new URLSearchParams();
    if (q) params.append("q", q);
    if (product_code) params.append("product_code", product_code);
    if (color) params.append("color", color);
    if (size) params.append("size", String(size));

    const res = await fetch(`${API_UR}/search/variants?${params.toString()}`);
    if (!res.ok) throw new Error("Search request failed");
    const data = await res.json();

    return data.map((item: any) => ({
        id: item.id,
        sku: item.variant_sku,
        product_code: item.Product?.product_code,
        name: item.Product?.name || "Unnamed",
        description: item.Product?.description || "",
        attributes: item.attributes_json ? JSON.parse(item.attributes_json) : {},
    }));
}



export async function createProduct(data: any) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function updateProduct(id: string, data: any) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function deleteProduct(id: string) {
    return fetch(`${API_URL}/${id}`, { method: "DELETE" });
}
