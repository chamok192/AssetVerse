import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRequest, getRequests } from "../../../Services/api";
import DashboardLayout from "./DashboardLayout";
import { toast } from 'react-toastify';

const statusColors = {
    pending: "badge-warning",
    accepted: "badge-success",
    rejected: "badge-error"
};

const AllRequests = () => {
    const queryClient = useQueryClient();
    const [processingId, setProcessingId] = useState(null);

    // Fetch requests using TanStack Query
    const { data: requests = [], isLoading } = useQuery({
        queryKey: ['requests'],
        queryFn: async () => {
            const result = await getRequests();
            return result.success ? (Array.isArray(result.data) ? result.data : []) : [];
        },
        onError: (err) => console.error('Failed to fetch requests:', err)
    });

    // Mutation for approving requests
    const approveMutation = useMutation({
        mutationFn: (id) => updateRequest(id, { status: 'accepted' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            setProcessingId(null);
            toast.success('Request approved successfully!');
        },
        onError: (error) => toast.error(error.message || 'Failed to approve request')
    });

    // Mutation for rejecting requests
    const rejectMutation = useMutation({
        mutationFn: (id) => updateRequest(id, { status: 'rejected' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            setProcessingId(null);
            toast.success('Request rejected successfully!');
        },
        onError: (error) => toast.error(error.message || 'Failed to reject request')
    });

    const handleApprove = (requestId) => {
        const confirmed = window.confirm("Approve this request? This will deduct asset quantity.");
        if (!confirmed) return;
        setProcessingId(requestId);
        approveMutation.mutate(requestId);
    };

    const handleReject = (requestId) => {
        const confirmed = window.confirm("Reject this request?");
        if (!confirmed) return;
        setProcessingId(requestId);
        rejectMutation.mutate(requestId);
    };

    return (
        <DashboardLayout
            title="Requests"
            subtitle="Review employee asset requests and approve or reject with one click."
        >
            <div className="overflow-x-auto rounded-box bg-base-100 shadow">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Asset</th>
                            <th>Note</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan={6} className="py-6 text-center">
                                    <span className="loading loading-spinner"></span>
                                </td>
                            </tr>
                        )}

                        {!isLoading && requests.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-6 text-center text-base-content/70">
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
                                        <p className="font-semibold">{req.asset?.name || req.assetName || "Asset"}</p>
                                        <p className="text-sm text-base-content/60">Qty: {req.quantity ?? 1}</p>
                                    </div>
                                </td>
                                <td>{req.note || "-"}</td>
                                <td>{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "-"}</td>
                                <td>
                                    <span className={`badge capitalize ${statusColors[req.status] || "badge-ghost"}`}>
                                        {req.status || "pending"}
                                    </span>
                                </td>
                                <td className="text-right space-x-2">
                                    <button
                                        type="button"
                                        className="btn btn-sm"
                                        onClick={() => handleApprove(req._id)}
                                        disabled={processingId === req._id || req.status === "accepted" || approveMutation.isPending || rejectMutation.isPending}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline"
                                        onClick={() => handleReject(req._id)}
                                        disabled={processingId === req._id || req.status === "rejected" || approveMutation.isPending || rejectMutation.isPending}
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
