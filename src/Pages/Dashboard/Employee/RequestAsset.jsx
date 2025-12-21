import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAssets, createRequest, getUserData } from '../../../Services/api';
import EmployeeDashboardLayout from './EmployeeDashboardLayout';
import { toast } from 'react-toastify';

const RequestAsset = () => {
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [note, setNote] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 10;
    const queryClient = useQueryClient();

    const { data: queryData = { data: [], totalPages: 1 }, isLoading } = useQuery({
        queryKey: ['assets', { page, limit, stockStatus: 'available' }],
        queryFn: async () => {
            const result = await getAssets(page, limit, '', 'all', 'available');
            return {
                data: result.data || [],
                totalPages: result.totalPages || 1
            };
        },
        keepPreviousData: true
    });

    const assets = queryData.data;
    const totalPages = queryData.totalPages;

    const requestMutation = useMutation({
        mutationFn: (payload) => createRequest(payload),
        onSuccess: () => {
            toast.success('Request submitted successfully!');
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            setShowModal(false);
            setNote('');
            setSelectedAsset(null);
        },
        onError: (err) => {
            toast.error('Failed to submit request: ' + (err?.error || 'Unknown error'));
        }
    });

    const handleRequestClick = (asset) => {
        setSelectedAsset(asset);
        setShowModal(true);
    };

    const handleSubmitRequest = () => {
        if (!selectedAsset) return;
        const user = getUserData();
        if (!user?.email) {
            toast.error('User email not found. Please login again.');
            return;
        }

        requestMutation.mutate({
            assetId: selectedAsset._id,
            note: note,
            status: 'pending',
            employeeEmail: user.email
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
            {assets.length === 0 ? (
                <div className="rounded-lg bg-base-200 p-8 text-center">
                    <p className="text-base-content/60">No assets available for request</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {assets.map((asset) => {
                            const assetName = asset.productName || asset.name || "Untitled";
                            const assetImage = asset.productImage || asset.image || "";
                            const assetType = asset.productType || asset.type || "Returnable";
                            const availableQty = asset.availableQuantity ?? asset.quantity ?? 0;

                            return (
                                <div key={asset._id} className="rounded-lg border border-base-300 bg-base-100 p-6 shadow">
                                    <div className="mb-4 h-48 overflow-hidden rounded-lg bg-base-200">
                                        <img
                                            src={assetImage}
                                            alt={assetName}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-lg font-bold">{assetName}</h3>
                                    <p className="mb-2 text-sm text-base-content/60">
                                        <span className={`badge ${assetType.toLowerCase() === 'returnable' ? 'badge-info' : 'badge-warning'}`}>
                                            {assetType}
                                        </span>
                                    </p>
                                    <p className="mb-4 text-sm">
                                        Available: <span className="font-semibold">{availableQty}</span>
                                    </p>
                                    <button
                                        onClick={() => handleRequestClick(asset)}
                                        className="btn btn-primary btn-sm w-full"
                                    >
                                        Request
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-center mt-8 gap-2">
                        <button
                            className="btn btn-sm"
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                        >
                            Previous
                        </button>
                        <span className="btn btn-sm btn-ghost no-animation cursor-default">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            className="btn btn-sm"
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {showModal && selectedAsset && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="text-lg font-bold">Request Asset</h3>
                        <p className="py-4">Requesting: <span className="font-semibold">{selectedAsset.productName || selectedAsset.name}</span></p>

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
