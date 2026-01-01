import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getEmployeeAssets, deleteEmployeeAsset, api } from '../../../Services/api';
import EmployeeDashboardLayout from './EmployeeDashboardLayout';
import { toast } from 'react-toastify';

const EmployeeAssets = () => {
    const [search, setSearch] = useState('');
    const [type, setType] = useState('');
    const queryClient = useQueryClient();

    const { data: response = {}, isLoading, refetch } = useQuery({
        queryKey: ['employee-assets', search, type],
        queryFn: async () => {
            const result = await getEmployeeAssets(search, type);
            return result;
        }
    });

    const assets = (response.data || []).filter((asset, index, self) =>
        self.findIndex(a => a._id === asset._id) === index
    );

    const handleReturn = async (id) => {
        try {
            await api.post(`/api/employee-assets/${id}/return`, {
                returnDate: new Date().toISOString(),
                notes: ''
            });
            toast.success('Asset returned successfully!');
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            refetch();
        } catch (err) {
            toast.error('Failed to return asset: ' + (err?.response?.data?.error || 'Unknown error'));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this asset assignment?')) return;
        try {
            await deleteEmployeeAsset(id);
            toast.success('Asset assignment deleted successfully!');
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            refetch();
        } catch (err) {
            toast.error('Failed to delete asset: ' + (err?.response?.data?.error || 'Unknown error'));
        }
    };

    if (isLoading) {
        return (
            <EmployeeDashboardLayout title="My Assets" subtitle="View your assigned assets">
                <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </EmployeeDashboardLayout>
        );
    }

    return (
        <EmployeeDashboardLayout title="My Assets" subtitle="View your assigned assets">
            <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
                    <input
                        type="text"
                        placeholder="Search assets..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input input-bordered flex-1"
                    />
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="select select-bordered"
                    >
                        <option value="">All Types</option>
                        <option value="returnable">Returnable</option>
                        <option value="non-returnable">Non-Returnable</option>
                    </select>
                    <button onClick={() => window.print()} className="btn btn-outline">
                        Print
                    </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-base-300">
                    <table className="table">
                        <thead>
                            <tr className="bg-base-200">
                                <th>Image</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Company</th>
                                <th>Request Date</th>
                                <th>Approval Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map(asset => {
                                const assetName = asset.assetName || 'Unknown Asset';
                                const assetImage = asset.assetImage || 'https://placehold.co/40';
                                const assetType = asset.assetType || 'Unknown';
                                const companyName = asset.companyName || 'Unknown Company';
                                const requestDate = asset.requestDate;
                                const approvalDate = asset.assignmentDate;
                                const status = asset.status || 'assigned';

                                const isReturnable = assetType === 'Returnable' || assetType === 'returnable';

                                return (
                                    <tr key={asset._id} className="hover">
                                        <td>
                                            <img
                                                src={assetImage}
                                                alt={assetName}
                                                className="h-10 w-10 rounded object-cover"
                                                onError={(e) => { e.target.src = 'https://placehold.co/40?text=No+Image'; }}
                                            />
                                        </td>
                                        <td className="font-medium">{assetName}</td>
                                        <td className="capitalize">{assetType}</td>
                                        <td>{companyName}</td>
                                        <td>{requestDate ? new Date(requestDate).toLocaleDateString() : 'N/A'}</td>
                                        <td>{approvalDate ? new Date(approvalDate).toLocaleDateString() : 'N/A'}</td>
                                        <td>
                                            <span className={`badge ${status === 'assigned' ? 'badge-success' : 'badge-neutral'
                                                }`}>
                                                {status === 'assigned' ? 'Approved' : status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                                                {isReturnable && status === 'assigned' && (
                                                    <button
                                                        onClick={() => handleReturn(asset._id)}
                                                        className="btn btn-sm btn-error"
                                                    >
                                                        Return
                                                    </button>
                                                )}
                                                {!isReturnable && status === 'assigned' && (
                                                    <button
                                                        onClick={() => handleDelete(asset._id)}
                                                        className="btn btn-sm btn-outline btn-error"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {assets.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="text-center py-8">
                                        No assets found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </EmployeeDashboardLayout>
    );
};

export default EmployeeAssets;
