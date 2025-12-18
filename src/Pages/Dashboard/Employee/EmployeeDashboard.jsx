import { useQuery } from '@tanstack/react-query';
import { getAssets } from '../../../Services/api';
import EmployeeDashboardLayout from './EmployeeDashboardLayout';
import { useNavigate } from 'react-router';

const EmployeeDashboard = () => {
    const navigate = useNavigate();

    const { data: queryData = { data: [], totalAssets: 0, availableCount: 0 }, isLoading } = useQuery({
        queryKey: ['assets'],
        queryFn: async () => {
            const result = await getAssets();
            return {
                data: result.data || [],
                totalAssets: result.totalAssets || 0,
                availableCount: result.availableCount || 0
            };
        }
    });

    const assets = queryData.data;
    const totalAssets = queryData.totalAssets;
    const availableCount = queryData.availableCount;
    const availableAssetsPreview = assets.filter(asset => asset.quantity > 0);

    if (isLoading) {
        return (
            <EmployeeDashboardLayout title="Dashboard" subtitle="Welcome to your asset management dashboard">
                <div className="flex items-center justify-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </EmployeeDashboardLayout>
        );
    }

    return (
        <EmployeeDashboardLayout title="Dashboard" subtitle="Welcome to your asset management dashboard">
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-base-200 bg-base-100 p-4 shadow-sm">
                        <p className="text-sm text-base-content/70">Total Assets</p>
                        <p className="text-3xl font-bold">{totalAssets}</p>
                    </div>
                    <div className="rounded-xl border border-base-200 bg-base-100 p-4 shadow-sm">
                        <p className="text-sm text-base-content/70">Available Assets</p>
                        <p className="text-3xl font-bold text-success">{availableCount}</p>
                    </div>
                    <div className="rounded-xl border border-base-200 bg-base-100 p-4 shadow-sm">
                        <p className="text-sm text-base-content/70">Out of Stock</p>
                        <p className="text-3xl font-bold text-warning">{totalAssets - availableCount}</p>
                    </div>
                </div>

                {/* Quick Actions */}
                {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <button
                        onClick={() => navigate('/employee/assets')}
                        className="rounded-lg border-2 border-primary bg-base-100 p-6 text-center transition hover:bg-primary hover:text-primary-content"
                    >
                        <div className="text-3xl mb-2">📦</div>
                        <p className="font-semibold">My Assets</p>
                        <p className="text-sm text-base-content/60">View your assets</p>
                    </button>
                    <button
                        onClick={() => navigate('/employee/request')}
                        className="rounded-lg border-2 border-primary bg-base-100 p-6 text-center transition hover:bg-primary hover:text-primary-content"
                    >
                        <div className="text-3xl mb-2">📋</div>
                        <p className="font-semibold">Request Asset</p>
                        <p className="text-sm text-base-content/60">Browse & request</p>
                    </button>
                    <button
                        onClick={() => navigate('/employee/team')}
                        className="rounded-lg border-2 border-primary bg-base-100 p-6 text-center transition hover:bg-primary hover:text-primary-content"
                    >
                        <div className="text-3xl mb-2">👥</div>
                        <p className="font-semibold">My Team</p>
                        <p className="text-sm text-base-content/60">View teammates</p>
                    </button>
                    <button
                        onClick={() => navigate('/profile')}
                        className="rounded-lg border-2 border-primary bg-base-100 p-6 text-center transition hover:bg-primary hover:text-primary-content"
                    >
                        <div className="text-3xl mb-2">👤</div>
                        <p className="font-semibold">Profile</p>
                        <p className="text-sm text-base-content/60">View profile</p>
                    </button>
                </div> */}

                {/* Available Assets Preview */}
                <div className="rounded-2xl bg-base-100 p-6 shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Available Assets</h3>
                        <button
                            onClick={() => navigate('/employee/request')}
                            className="btn btn-sm btn-primary"
                        >
                            View All
                        </button>
                    </div>
                    {availableAssetsPreview.length === 0 ? (
                        <div className="text-center py-8 text-base-content/60">
                            <p>No assets available at the moment</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {availableAssetsPreview.slice(0, 6).map((asset) => (
                                <div key={asset._id} className="rounded-lg border border-base-300 p-4">
                                    <div className="mb-3 h-32 overflow-hidden rounded-lg bg-base-200">
                                        <img
                                            src={asset.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23e0e0e0' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='%23999' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"}
                                            alt={asset.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <h4 className="font-semibold">{asset.name}</h4>
                                    <p className="text-sm text-base-content/60 mb-2">
                                        Qty: <span className="font-semibold text-success">{asset.quantity}</span>
                                    </p>
                                    <button
                                        onClick={() => navigate('/employee/request')}
                                        className="btn btn-sm btn-outline w-full"
                                    >
                                        Request
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </EmployeeDashboardLayout>
    );
};

export default EmployeeDashboard;
