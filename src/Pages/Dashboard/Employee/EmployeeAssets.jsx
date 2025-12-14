import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAssets } from '../../../Services/api';
import EmployeeDashboardLayout from './EmployeeDashboardLayout';

const EmployeeAssets = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');

    const { data: assets = [], isLoading } = useQuery({
        queryKey: ['assets'],
        queryFn: async () => {
            const result = await getAssets();
            return result.success ? (Array.isArray(result.data) ? result.data : []) : [];
        }
    });

    const filteredAssets = assets.filter(asset => {
        const matchesSearch = asset.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !filterType || asset.type === filterType;
        return matchesSearch && matchesType;
    });

    const handleReturn = () => {
        // TODO: Implement asset return functionality
    };

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <EmployeeDashboardLayout title="My Assets" subtitle="View assets assigned to you.">
                <div className="flex items-center justify-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </EmployeeDashboardLayout>
        );
    }

    return (
        <EmployeeDashboardLayout title="My Assets" subtitle="View assets assigned to you.">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                        <input
                            type="text"
                            placeholder="Search by asset name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-bordered flex-1"
                        />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="select select-bordered"
                        >
                            <option value="">All Types</option>
                            <option value="returnable">Returnable</option>
                            <option value="non-returnable">Non-returnable</option>
                        </select>
                    </div>
                    <button onClick={handlePrint} className="btn btn-outline">
                        Print
                    </button>
                </div>

                {filteredAssets.length === 0 ? (
                    <div className="rounded-lg bg-base-200 p-8 text-center">
                        <p className="text-base-content/60">No assets found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-base-300">
                        <table className="w-full">
                            <thead className="bg-base-200">
                                <tr>
                                    <th className="p-4 text-left">Image</th>
                                    <th className="p-4 text-left">Asset Name</th>
                                    <th className="p-4 text-left">Type</th>
                                    <th className="p-4 text-left">Company</th>
                                    <th className="p-4 text-left">Request Date</th>
                                    <th className="p-4 text-left">Approval Date</th>
                                    <th className="p-4 text-left">Status</th>
                                    <th className="p-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAssets.map((asset) => (
                                    <tr key={asset._id} className="border-t border-base-300 hover:bg-base-100">
                                        <td className="p-4">
                                            <img
                                                src={asset.image}
                                                alt={asset.name}
                                                className="h-10 w-10 rounded object-cover"
                                            />
                                        </td>
                                        <td className="p-4">{asset.name}</td>
                                        <td className="p-4">
                                            <span className={`badge ${asset.type === 'returnable' ? 'badge-info' : 'badge-warning'}`}>
                                                {asset.type}
                                            </span>
                                        </td>
                                        <td className="p-4">Company</td>
                                        <td className="p-4">-</td>
                                        <td className="p-4">-</td>
                                        <td className="p-4">
                                            <span className="badge badge-success">Assigned</span>
                                        </td>
                                        <td className="p-4">
                                            {asset.type === 'returnable' && (
                                                <button
                                                    onClick={() => handleReturn()}
                                                    className="btn btn-sm btn-ghost"
                                                >
                                                    Return
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </EmployeeDashboardLayout>
    );
};

export default EmployeeAssets;
