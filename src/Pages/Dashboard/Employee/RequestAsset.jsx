import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAssets, createRequest } from '../../../Services/api';
import EmployeeDashboardLayout from './EmployeeDashboardLayout';

const RequestAsset = () => {
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [note, setNote] = useState('');
    const [showModal, setShowModal] = useState(false);
    const queryClient = useQueryClient();

    const { data: assets = [], isLoading } = useQuery({
        queryKey: ['assets'],
        queryFn: async () => {
            const result = await getAssets();
            return result.success ? (Array.isArray(result.data) ? result.data : []) : [];
        }
    });

    const requestMutation = useMutation({
        mutationFn: (payload) => createRequest(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            setShowModal(false);
            setNote('');
            setSelectedAsset(null);
        }
    });

    const availableAssets = assets.filter(asset => asset.quantity > 0);

    const handleRequestClick = (asset) => {
        setSelectedAsset(asset);
        setShowModal(true);
    };

    const handleSubmitRequest = () => {
        if (!selectedAsset) return;
        
        requestMutation.mutate({
            assetId: selectedAsset._id,
            note: note,
            status: 'pending'
        });
    };

    if (isLoading) {
        return (
            <EmployeeDashboardLayout title="Request an Asset" subtitle="Browse and request assets from available inventory.">
                <div className="flex items-center justify-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </EmployeeDashboardLayout>
        );
    }

    return (
        <EmployeeDashboardLayout title="Request an Asset" subtitle="Browse and request assets from available inventory.">
            {availableAssets.length === 0 ? (
                <div className="rounded-lg bg-base-200 p-8 text-center">
                    <p className="text-base-content/60">No assets available for request</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {availableAssets.map((asset) => (
                        <div key={asset._id} className="rounded-lg border border-base-300 bg-base-100 p-6 shadow">
                            <div className="mb-4 h-48 overflow-hidden rounded-lg bg-base-200">
                                <img
                                    src={asset.image}
                                    alt={asset.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <h3 className="text-lg font-bold">{asset.name}</h3>
                            <p className="mb-2 text-sm text-base-content/60">
                                <span className={`badge ${asset.type === 'returnable' ? 'badge-info' : 'badge-warning'}`}>
                                    {asset.type}
                                </span>
                            </p>
                            <p className="mb-4 text-sm">
                                Available: <span className="font-semibold">{asset.quantity}</span>
                            </p>
                            <button
                                onClick={() => handleRequestClick(asset)}
                                className="btn btn-primary btn-sm w-full"
                            >
                                Request
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showModal && selectedAsset && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="text-lg font-bold">Request Asset</h3>
                        <p className="py-4">Requesting: <span className="font-semibold">{selectedAsset.name}</span></p>
                        
                        <textarea
                            className="textarea textarea-bordered w-full"
                            placeholder="Add a note (optional)"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        ></textarea>

                        <div className="modal-action">
                            <button
                                className="btn"
                                onClick={() => {
                                    setShowModal(false);
                                    setNote('');
                                    setSelectedAsset(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmitRequest}
                                disabled={requestMutation.isPending}
                            >
                                {requestMutation.isPending ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowModal(false)}></div>
                </div>
            )}
        </EmployeeDashboardLayout>
    );
};

export default RequestAsset;
