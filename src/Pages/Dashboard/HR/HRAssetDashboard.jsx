import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
    deleteAsset,
    getAssets,
    getHRAnalytics
} from "../../../Services/api";
import DashboardLayout from "./DashboardLayout";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const HRAssetDashboard = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortKey, setSortKey] = useState("date-desc");
    const [deletingId, setDeletingId] = useState(null);

    // Page state restored
    const [page, setPage] = useState(1);
    const limit = 10;


    const { data: queryData = { data: [], totalPages: 1, totalAssets: 0, totalQuantity: 0, lowStock: 0 }, isLoading } = useQuery({
        queryKey: ['assets', { page, limit, search, typeFilter, categoryFilter }],
        queryFn: async () => {
            const result = await getAssets(page, limit, search, typeFilter);
            return {
                data: result.success ? result.data.data : [],
                totalPages: result.success ? result.data.totalPages : 1,
                totalAssets: result.success ? result.data.totalAssets : 0,
                totalQuantity: result.success ? result.data.totalQuantity : 0,
                lowStock: result.success ? result.data.lowStock : 0
            };
        },
        keepPreviousData: true
    });

    const { data: analyticsData = { typeDistribution: [], topRequests: [] } } = useQuery({
        queryKey: ['hr-analytics'],
        queryFn: async () => {
            const result = await getHRAnalytics();
            return result.success ? result.data : { typeDistribution: [], topRequests: [] };
        }
    });

    const assets = queryData.data;
    const totalPages = queryData.totalPages;



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
        // Since we are doing server side pagination/searching, the data 'assets' is already filtered by search/type from the server.
        // We only apply client side sorting on the current page data for UX responsiveness on the view.

        const sorted = [...assets].sort((a, b) => {
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

        // Secondary client-side Category filter (if needed, though ideally should be server too)
        if (categoryFilter !== 'all') {
            return sorted.filter(asset => asset.category === categoryFilter);
        }

        return sorted;
    }, [assets, sortKey, categoryFilter]);

    const totals = useMemo(() => {
        return {
            totalQuantity: queryData.totalQuantity || 0,
            lowStock: queryData.lowStock || 0,
            count: queryData.totalAssets || 0
        };
    }, [queryData]);

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
            {/* Analytics Section */}
            <div className="grid gap-6 lg:grid-cols-2 mb-8">
                <div className="rounded-2xl bg-base-100 p-6 shadow">
                    <h3 className="mb-4 text-lg font-bold">Item Distribution</h3>
                    <div className="relative h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                            <PieChart>
                                <Pie
                                    data={analyticsData.typeDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {analyticsData.typeDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-2xl bg-base-100 p-6 shadow">
                    <h3 className="mb-4 text-lg font-bold">Top 5 Requested Assets</h3>
                    <div className="relative h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                            <BarChart data={analyticsData.topRequests}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

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
                            <th className="hidden md:table-cell">Type</th>
                            <th>Quantity</th>
                            <th className="hidden lg:table-cell">Date Added</th>
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
                            const available = asset.availableQuantity ?? asset.productQuantity ?? asset.quantity ?? 0;
                            const total = asset.productQuantity ?? asset.quantity ?? available;
                            const qtyColor = available <= 5 ? "text-warning" : "text-success";
                            const assetName = asset.productName || asset.name || "Untitled";
                            const assetImage = asset.productImage || asset.image || asset.imageUrl;
                            const assetType = asset.productType || asset.type || "N/A";

                            return (
                                <tr key={asset._id} className="hover">
                                    <td>
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12 bg-base-200">
                                                {assetImage ? (
                                                    <img
                                                        src={assetImage}
                                                        alt={assetName}
                                                        onError={(e) => { e.target.src = 'https://placehold.co/40?text=No+Img'; }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-warning/20 flex items-center justify-center text-xs font-bold text-warning">
                                                        No Img
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-semibold">{assetName}</div>
                                        <div className="text-sm text-base-content/60">{asset.serial || asset.tag || ""}</div>
                                    </td>
                                    <td className="hidden md:table-cell">
                                        <span className="badge badge-soft badge-primary capitalize">{assetType}</span>
                                    </td>
                                    <td className={`font-semibold ${qtyColor}`}>{available}</td>

                                    <td className="hidden lg:table-cell">{asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : "-"}</td>
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


            <div className="flex justify-center mt-6">
                <div className="join">
                    <button
                        className="join-item btn"
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                        «
                    </button>
                    <button className="join-item btn">Page {page} of {totalPages}</button>
                    <button
                        className="join-item btn"
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        »
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default HRAssetDashboard;
