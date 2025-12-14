import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    deleteAsset,
    getAssets
} from "../../../Services/api";
import DashboardLayout from "./DashboardLayout";

const HRAssetDashboard = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortKey, setSortKey] = useState("date-desc");
    const [deletingId, setDeletingId] = useState(null);

    // Fetch assets using TanStack Query
    const { data: assets = [], isLoading } = useQuery({
        queryKey: ['assets'],
        queryFn: async () => {
            const result = await getAssets();
            return result.success ? (Array.isArray(result.data) ? result.data : []) : [];
        }
    });

    // Mutation for deleting assets
    const deleteAssetMutation = useMutation({
        mutationFn: deleteAsset,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            setDeletingId(null);
        }
    });

    const uniqueCategories = useMemo(() => {
        const buckets = new Set();
        assets.forEach((asset) => {
            if (asset.category) buckets.add(asset.category);
        });
        return Array.from(buckets);
    }, [assets]);

    const filteredAssets = useMemo(() => {
        const term = search.trim().toLowerCase();

        const filtered = assets.filter((asset) => {
            const assetName = asset.productName || asset.name || "";
            const assetType = asset.productType || asset.type || "";
            const assetTag = asset.tag || "";
            const assetSerial = asset.serial || "";

            const matchesSearch = !term ||
                assetName.toLowerCase().includes(term) ||
                assetType.toLowerCase().includes(term) ||
                assetTag.toLowerCase().includes(term) ||
                assetSerial.toLowerCase().includes(term);

            const matchesType = typeFilter === "all" || (assetType.toLowerCase() === typeFilter);
            const matchesCategory = categoryFilter === "all" || (asset.category === categoryFilter);
            return matchesSearch && matchesType && matchesCategory;
        });

        const sorted = [...filtered].sort((a, b) => {
            if (sortKey === "date-desc") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            if (sortKey === "date-asc") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
            const qtyA = a.productQuantity ?? a.quantity ?? 0;
            const qtyB = b.productQuantity ?? b.quantity ?? 0;
            if (sortKey === "qty-desc") return qtyB - qtyA;
            if (sortKey === "qty-asc") return qtyA - qtyB;
            const nameA = a.productName || a.name || "";
            const nameB = b.productName || b.name || "";
            return nameA.localeCompare(nameB);
        });

        return sorted;
    }, [assets, search, typeFilter, categoryFilter, sortKey]);

    const totals = useMemo(() => {
        const totalQuantity = assets.reduce((sum, item) => sum + (Number(item.productQuantity || item.quantity) || 0), 0);
        const lowStock = assets.filter((item) => (Number(item.productQuantity || item.quantity) || 0) <= 5).length;
        return { totalQuantity, lowStock, count: assets.length };
    }, [assets]);

    const handleDelete = async (assetId) => {
        setDeletingId(assetId);
        deleteAssetMutation.mutate(assetId);
    };

    const clearFilters = () => {
        setSearch("");
        setTypeFilter("all");
        setCategoryFilter("all");
        setSortKey("date-desc");
    };

    return (
        <DashboardLayout
            title="Asset Management"
            subtitle="Track hardware, office gear, and peripherals in one place."
        >
            <div className="rounded-2xl bg-base-100 p-5 shadow">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-base-content/70">Overview</p>
                        <h2 className="text-2xl font-bold">Inventory pulse</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => navigate("/hr/assets/new")}
                        >
                            + Add Asset
                        </button>
                    </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-base-200 bg-base-100 p-4 shadow-sm">
                        <p className="text-sm text-base-content/70">Total Assets</p>
                        <p className="text-2xl font-bold">{totals.count}</p>
                    </div>
                    <div className="rounded-xl border border-base-200 bg-base-100 p-4 shadow-sm">
                        <p className="text-sm text-base-content/70">In Stock Units</p>
                        <p className="text-2xl font-bold">{totals.totalQuantity}</p>
                    </div>
                    <div className="rounded-xl border border-base-200 bg-base-100 p-4 shadow-sm">
                        <p className="text-sm text-base-content/70">Low Stock (≤5)</p>
                        <p className="text-2xl font-bold text-warning">{totals.lowStock}</p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl bg-base-100 p-4 shadow">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                        <label className="input input-bordered flex items-center gap-2 flex-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-base-content/60">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.75 5.75a7.5 7.5 0 0010.9 10.9z" />
                            </svg>
                            <input
                                type="text"
                                className="grow"
                                placeholder="Search by name, tag, or serial"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </label>

                        <div className="flex gap-2">
                            <select
                                className="select select-bordered"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                <option value="returnable">Returnable</option>
                                <option value="non-returnable">Non-returnable</option>
                            </select>

                            <select
                                className="select select-bordered"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                {uniqueCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-base-content/70">Sort by</span>
                        <select
                            className="select select-bordered"
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value)}
                        >
                            <option value="date-desc">Date Added (newest)</option>
                            <option value="date-asc">Date Added (oldest)</option>
                            <option value="qty-desc">Quantity (high)</option>
                            <option value="qty-asc">Quantity (low)</option>
                            <option value="name">Name (A-Z)</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        type="button"
                        className={`btn btn-sm ${typeFilter === "all" ? "btn-primary" : "btn-ghost"}`}
                        onClick={() => setTypeFilter("all")}
                    >
                        All Assets
                    </button>
                    <button
                        type="button"
                        className={`btn btn-sm ${typeFilter === "returnable" ? "btn-primary" : "btn-ghost"}`}
                        onClick={() => setTypeFilter("returnable")}
                    >
                        Returnable
                    </button>
                    <button
                        type="button"
                        className={`btn btn-sm ${typeFilter === "non-returnable" ? "btn-primary" : "btn-ghost"}`}
                        onClick={() => setTypeFilter("non-returnable")}
                    >
                        Non-returnable
                    </button>
                </div>
            </div>

            {deleteAssetMutation.error && (
                <div className="alert alert-error shadow">
                    <span>{deleteAssetMutation.error?.message || "Failed to delete asset"}</span>
                </div>
            )}

            <div className="overflow-x-auto rounded-2xl bg-base-100 shadow">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Asset</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Date Added</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan={6} className="text-center py-6">
                                    <span className="loading loading-spinner"></span>
                                </td>
                            </tr>
                        )}

                        {!isLoading && filteredAssets.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-6 text-center text-base-content/70">
                                    No assets found. Try adjusting filters.
                                </td>
                            </tr>
                        )}

                        {!isLoading && filteredAssets.map((asset) => {
                            const qty = asset.productQuantity ?? asset.quantity ?? 0;
                            const qtyColor = qty <= 5 ? "text-warning" : "text-success";
                            const assetName = asset.productName || asset.name || "Untitled";
                            const assetImage = asset.productImage || asset.image || asset.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23e0e0e0' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='%23999' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                            const assetType = asset.productType || asset.type || "N/A";
                            
                            return (
                                <tr key={asset._id} className="hover">
                                    <td>
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12 bg-base-200">
                                                <img
                                                    src={assetImage}
                                                    alt={assetName}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-semibold">{assetName}</div>
                                        <div className="text-sm text-base-content/60">{asset.serial || asset.tag || ""}</div>
                                    </td>
                                    <td>
                                        <span className="badge badge-soft badge-primary capitalize">{assetType}</span>
                                    </td>
                                    <td className={`font-semibold ${qtyColor}`}>{qty}</td>
                                    <td>{asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : "-"}</td>
                                    <td className="space-x-2 text-right">
                                        <button
                                            type="button"
                                            className="btn btn-sm"
                                            onClick={() => navigate(`/hr/assets/${asset._id}/edit`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline btn-error"
                                            onClick={() => handleDelete(asset._id)}
                                            disabled={deletingId === asset._id}
                                        >
                                            {deletingId === asset._id ? "Deleting..." : "Delete"}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default HRAssetDashboard;
