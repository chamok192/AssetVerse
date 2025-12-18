import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRequest, getRequests, getEmployeeLimitCheck } from "../../../Services/api";
import DashboardLayout from "./DashboardLayout";
import { toast } from 'react-toastify';
import { useAuth } from "../../../Contents/AuthContext/useAuth";

const statusColors = {
    pending: "badge-warning",
    accepted: "badge-success",
    rejected: "badge-error"
};

const AllRequests = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { user: hrProfile } = useAuth();
    const [processingId, setProcessingId] = useState(null);


    const { data: requests = [], isLoading } = useQuery({
        queryKey: ['requests'],
        queryFn: async () => {
            const result = await getRequests();
            return result.success ? (Array.isArray(result.data) ? result.data : []) : [];
        },
        onError: (err) => console.error('Failed to fetch requests:', err)
    });


    const { data: limitData, isLoading: limitLoading } = useQuery({
        queryKey: ['employee-limit'],
        queryFn: async () => {
            const result = await getEmployeeLimitCheck();
            return result.success ? result.data : null;
        },
        onError: (err) => console.error('Failed to fetch limit:', err)
    });


    const approveMutation = useMutation({
        mutationFn: (id) => updateRequest(id, { status: 'accepted' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            queryClient.invalidateQueries({ queryKey: ['employee-limit'] });
            setProcessingId(null);
            toast.success('Request approved successfully!');
        },
        onError: (error) => {
            setProcessingId(null);
            if (error.includes('limit reached')) {
                toast.error("Plan limit exceeded. Please upgrade.");
                navigate('/hr/upgrade');
            } else {
                toast.error(error || 'Failed to approve request');
            }
        }
    });


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
                                        disabled={processingId === req._id || req.status === "accepted" || approveMutation.isPending || rejectMutation.isPending || !limitData?.canAdd}
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
