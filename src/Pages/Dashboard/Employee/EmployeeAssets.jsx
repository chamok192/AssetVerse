import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEmployeeAssets } from '../../../Services/api';
import EmployeeDashboardLayout from './EmployeeDashboardLayout';

const EmployeeAssets = () => {
    const [search, setSearch] = useState('');
    const [type, setType] = useState('');

    const { data: response = {}, isLoading, refetch } = useQuery({
        queryKey: ['employee-assets', search, type],
        queryFn: async () => {
            const result = await getEmployeeAssets();
            return result;
        }
    });

    const assets = response.data || [];

    const handleReturn = async (id) => {
        try {
            await api.post(`/api/employee-assets/${id}/return`, {
                returnDate: new Date().toISOString(),
                notes: ''
            });
            refetch();
        } catch (err) {
            // Error handled silently
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
                            {assets.length ? (
                                assets.map(asset => (
                                    <tr key={asset._id} className="hover">
                                        <td>
                                            <img
                                                src={asset.assetImage}
                                                alt={asset.assetName}
                                                className="h-10 w-10 rounded object-cover"
                                            />
                                        </td>
                                        <td className="font-medium">{asset.assetName}</td>
                                        <td className="capitalize">{asset.assetType}</td>
                                        <td>{asset.companyName}</td>
                                        <td>{new Date(asset.requestDate).toLocaleDateString()}</td>
                                        <td>{new Date(asset.approvalDate).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${
                                                asset.status === 'Approved' ? 'badge-success' : 'badge-warning'
                                            }`}>
                                                {asset.status}
                                            </span>
                                        </td>
                                        <td>
                                            {asset.canReturn && (
                                                <button
                                                    onClick={() => handleReturn(asset._id)}
                                                    className="btn btn-sm btn-error"
                                                >
                                                    Return
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
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
