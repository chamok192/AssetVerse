import { useQuery } from '@tanstack/react-query';
import { getAssets } from '../../../Services/api';
import EmployeeDashboardLayout from './EmployeeDashboardLayout';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../Contents/AuthContext/useAuth';

const EmployeeDashboard = () => {
    const navigate = useNavigate();

    const { user: authUser, load: authLoading } = useAuth();

    const { data: queryData = { data: [], totalAssets: 0, availableCount: 0 }, isLoading } = useQuery({
        queryKey: ['assets', authUser?.email],
        queryFn: async () => {
            const result = await getAssets(1, 100); // Fetch more for preview
            return {
                data: result.data || [],
                totalAssets: result.totalAssets || 0,
                availableCount: result.availableCount || 0
            };
        },
        enabled: !authLoading
    });

    const assets = queryData.data;
    const totalAssets = queryData.totalAssets;
    const availableCount = queryData.availableCount;
    const availableAssetsPreview = assets.filter(asset => (asset.availableQuantity ?? asset.quantity ?? 0) > 0);

    // Check profile sync
    const isProfileSynced = authUser && !!authUser.role && (
        authUser.role !== 'Employee' ||
        authUser.affiliations !== undefined
    );
    const isAffiliated = authUser?.affiliations && authUser.affiliations.length > 0;

    if (isLoading || authLoading || !isProfileSynced) {
        return (
            <EmployeeDashboardLayout title="Dashboard" subtitle="Welcome to your asset management dashboard">
                <div className="flex items-center justify-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </EmployeeDashboardLayout>
        );
    }

    if (!isAffiliated) {
        return (
            <EmployeeDashboardLayout title="Dashboard" subtitle="Affiliation required">
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl bg-base-100 p-8 text-center shadow">
                    <div className="mb-6 rounded-full bg-warning/10 p-6 text-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="mb-2 text-2xl font-bold">No Company Affiliation</h2>
                    <p className="max-w-md text-base-content/60 mb-6">
                        You currently don't belong to any company. To access your dashboard, please request an asset or contact your HR Manager to add you to their team.
                    </p>
                    <button onClick={() => navigate('/employee/request')} className="btn btn-primary">
                        Browse Assets & Request
                    </button>
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
                            {availableAssetsPreview.slice(0, 9).map((asset) => (
                                <div key={asset._id} className="rounded-lg border border-base-300 p-4">
                                    <div className="mb-3 h-32 overflow-hidden rounded-lg bg-base-200">
                                        <img
                                            src={asset.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23e0e0e0' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='%23999' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"}
                                            alt={asset.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <h4 className="font-semibold">{asset.productName || asset.name}</h4>
                                    <p className="text-sm text-base-content/60 mb-2">
                                        Qty: <span className="font-semibold text-success">{asset.availableQuantity ?? asset.quantity ?? 0}</span>
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
