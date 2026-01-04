import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRequest, getRequests, getEmployeeLimitCheck } from "../../../Services/api";
import DashboardLayout from "./DashboardLayout";
import { toast } from 'react-toastify';

const statusColors = {
    pending: "badge-warning",
    accepted: "badge-success",
    rejected: "badge-error"
};

const AllRequests = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: requests = [], isLoading } = useQuery({
        queryKey: ['requests'],
        queryFn: async () => {
            const result = await getRequests();
            return result.success ? (Array.isArray(result.data) ? result.data : []) : [];
        }
    });

    const { data: limitData } = useQuery({
        queryKey: ['employee-limit'],
        queryFn: async () => {
            const result = await getEmployeeLimitCheck();
            return result.success ? result.data : null;
        }
    });

    const approveMutation = useMutation({
        mutationFn: (id) => updateRequest(id, { status: 'accepted' }),
        // Optimistic update: decrement the asset availability in cache
        onMutate: async (requestId) => {
            await queryClient.cancelQueries(['requests']);
            const previousRequests = queryClient.getQueryData(['requests']);

            // Find the request to extract assetId
            const reqList = Array.isArray(previousRequests) ? previousRequests : (previousRequests?.data || previousRequests);
            const requestObj = Array.isArray(reqList) ? reqList.find(r => String(r._id) === String(requestId)) : null;
            const assetId = requestObj?.assetId;

            if (assetId) {
                // Decrement matching asset's availableQuantity across all assets queries
                queryClient.setQueriesData({ predicate: d => d.queryKey && d.queryKey[0] === 'assets' }, (old) => {
                    if (!old) return old;
                    // old may be an object with data field or an array
                    if (Array.isArray(old)) return old.map(a => a._id === assetId ? { ...a, availableQuantity: Math.max(0, (a.availableQuantity ?? a.quantity ?? 0) - 1) } : a);
                    if (old.data && Array.isArray(old.data)) {
                        return { ...old, data: old.data.map(a => a._id === assetId ? { ...a, availableQuantity: Math.max(0, (a.availableQuantity ?? a.quantity ?? 0) - 1) } : a) };
                    }
                    return old;
                });
            }

            return { previousRequests };
        },
        onSuccess: () => {
            // Ensure all relevant lists are refetched
            queryClient.invalidateQueries(['requests']);
            queryClient.invalidateQueries(['employees']);
            queryClient.invalidateQueries(['assets']);
            queryClient.invalidateQueries(['available-assets']);
            queryClient.invalidateQueries(['employee-limit']);
            toast.success('Request approved successfully!');
        },
        onError: (err, variables, context) => {
            // Rollback requests if needed
            if (context?.previousRequests) {
                queryClient.setQueryData(['requests'], context.previousRequests);
            }
            const message = err?.message || (typeof err === 'string' ? err : null);
            if (message && message.includes('limit reached')) {
                toast.error("Plan limit exceeded. Please upgrade.");
                navigate('/hr/upgrade');
            } else {
                toast.error(message || 'Failed to approve request');
            }
        },
        onSettled: () => {
            // Ensure assets are refetched
            queryClient.invalidateQueries(['assets']);
            queryClient.invalidateQueries(['available-assets']);
        }
    });

    const rejectMutation = useMutation({
        mutationFn: (id) => updateRequest(id, { status: 'rejected' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            toast.success('Request rejected successfully!');
        },
        onError: (error) => toast.error(error.message || 'Failed to reject request')
    });

    const handleApprove = (requestId) => {
        const confirmed = window.confirm("Approve this request? This will deduct asset quantity.");
        if (!confirmed) return;
        approveMutation.mutate(requestId);
    };

    const handleReject = (requestId) => {
        const confirmed = window.confirm("Reject this request?");
        if (!confirmed) return;
        rejectMutation.mutate(requestId);
    };

    return (
        <DashboardLayout
            title="Requests"
            subtitle="Review employee asset requests and approve or reject with one click."
        >
            {limitData && !limitData.canAdd && (
                <div className="alert alert-warning mb-4">
                    <span>Employee limit exceeded. Please upgrade your plan.</span>
                    <button className="btn btn-sm btn-primary" onClick={() => navigate('/hr/upgrade')}>
                        Upgrade
                    </button>
                </div>
            )}
            <div className="overflow-x-auto rounded-box bg-base-100 shadow">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Asset</th>
                            <th className="hidden md:table-cell">Note</th>
                            <th className="hidden lg:table-cell">Date</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan={4} className="py-6 text-center md:colspan-5 lg:colspan-6">
                                    <span className="loading loading-spinner"></span>
                                </td>
                            </tr>
                        )}

                        {!isLoading && requests.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-6 text-center text-base-content/70 md:colspan-5 lg:colspan-6">
                                    No requests found.
                                </td>
                            </tr>
                        )}

                        {!isLoading && requests.map((req) => (
                            <tr key={req._id} className="hover">
                                <td>
                                    <div>
                                        <p className="font-semibold">{req.employee?.name || "Unknown"}</p>
                                        <p className="text-sm text-base-content/60">{req.employee?.email}</p>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <p className="font-semibold">{req.asset?.productName || req.assetName || "Asset"}</p>
                                        <p className="text-sm text-base-content/60">Stock: {req.asset?.availableQuantity ?? req.asset?.quantity ?? "N/A"}</p>
                                    </div>
                                </td>
                                <td className="hidden md:table-cell">{req.note || "-"}</td>
                                <td className="hidden lg:table-cell">{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "-"}</td>
                                <td>
                                    <span className={`badge capitalize ${statusColors[req.status] || "badge-ghost"}`}>
                                        {req.status || "pending"}
                                    </span>
                                </td>
                                <td className="text-right space-x-2">
                                    <button
                                        type="button"
                                        className="btn btn-xs sm:btn-sm"
                                        onClick={() => handleApprove(req._id)}
                                        disabled={req.status === "accepted" || approveMutation.isPending || rejectMutation.isPending || !limitData?.canAdd}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-xs sm:btn-sm btn-outline"
                                        onClick={() => handleReject(req._id)}
                                        disabled={req.status === "rejected" || approveMutation.isPending || rejectMutation.isPending}
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default AllRequests;
