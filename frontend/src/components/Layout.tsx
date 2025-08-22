import type { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">📦 Product Dashboard</h1>
                <div className="space-x-6">
                    <a href="/dashboard" className="hover:underline">
                        Dashboard
                    </a>
                    <a href="/upload" className="hover:underline">
                        Upload
                    </a>
                </div>
            </nav>

            {/* Page Content */}
            <main className="p-6">{children}</main>
        </div>
    );
}
