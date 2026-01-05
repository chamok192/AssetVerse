import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getPaymentHistory, verifyPaymentSession, deletePayment } from "../../../Services/api";
import DashboardLayout from "./DashboardLayout";
import { useAuth } from "../../../Contents/AuthContext/useAuth";

const Payments = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const paymentSuccess = searchParams.get('payment') === 'success';
    const sessionId = searchParams.get('session_id');
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [paymentProcessed, setPaymentProcessed] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Delete handler
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;
        setDeletingId(id);
        const result = await deletePayment(id);
        if (result.success) {
            await refetch();
            if (selectedPayment && selectedPayment._id === id) setSelectedPayment(null);
        } else {
            alert(result.error || 'Failed to delete payment');
        }
        setDeletingId(null);
    };

    const { data: history = [], isLoading: historyLoading, refetch } = useQuery({
        queryKey: ['paymentHistory'],
        queryFn: async () => {
            const result = await getPaymentHistory();
            return result.success ? (Array.isArray(result.data) ? result.data : []) : [];
        }
    });

    // Verify session
    const { refetchProfile } = useAuth();

    const [verifyError, setVerifyError] = useState('');

    useEffect(() => {
        if (!sessionId || isVerifying) return;

        const verifyAndRefetch = async () => {
            setIsVerifying(true);
            setVerifyError('');
            try {
                const result = await verifyPaymentSession(sessionId);

                if (result.success) {
                    // Refetch data
                    await new Promise(resolve => setTimeout(resolve, 500));
                    await refetch();
                    // Update cache
                    queryClient.invalidateQueries(['paymentHistory']);
                    queryClient.invalidateQueries(['userData']);
                    // Refresh profile
                    try { refetchProfile(); } catch (e) { console.warn('refetchProfile not available', e); }

                    // Clear session
                    setSearchParams({ payment: 'success' });
                    setPaymentProcessed(true);
                    setShowSuccessNotification(true);
                } else {
                    console.error('Payment verification failed:', result.error);
                    setVerifyError(result.error || 'Payment verification failed');
                    // Verification failed
                    setSearchParams({});
                }
            } catch (error) {
                console.error('Error verifying session:', error);
                setVerifyError(error?.message || 'Error verifying payment');
            } finally {
                setIsVerifying(false);
            }
        };

        verifyAndRefetch();
    }, [sessionId, isVerifying, refetch, queryClient, setSearchParams, refetchProfile]);

    // Notification timer
    useEffect(() => {
        if (!showSuccessNotification) return;

        const timer = setTimeout(() => setShowSuccessNotification(false), 5000);
        return () => clearTimeout(timer);
    }, [showSuccessNotification]);

    return (
        <DashboardLayout
            title="Payment History"
            subtitle="View all your payment transactions and subscription details."
        >
            {paymentProcessed && showSuccessNotification && (
                <div className="alert alert-success shadow-lg mb-6 animate-bounce">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">Payment Successful! Your package has been upgraded.</span>
                    </div>
                </div>
            )}

            {verifyError && (
                <div className="alert alert-error shadow-lg mb-6">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2 4 4M6 18a9 9 0 1118 0 9 9 0 01-18 0z" />
                        </svg>
                        <span className="font-semibold">Payment verification failed:</span>
                        <span className="block mt-1">{verifyError}</span>
                    </div>
                </div>
            )}

            <div className="rounded-lg bg-base-100 p-3 sm:p-6 shadow">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold">All Transactions</h3>
                    <span className="text-sm text-base-content/60">{history.length} payments</span>
                </div>

                {/* Loading state */}
                {historyLoading && (
                    <div className="text-center py-8">
                        <span className="loading loading-spinner loading-md"></span>
                    </div>
                )}

                {/* Empty state */}
                {!historyLoading && history.length === 0 && (
                    <div className="text-center py-8 text-base-content/60">
                        No payments yet.
                        <a href="/hr/upgrade" className="link link-primary ml-2">
                            Upgrade your package
                        </a>
                    </div>
                )}

                {/* Mobile card layout */}
                {!historyLoading && history.length > 0 && (
                    <div className="flex flex-col gap-3 sm:hidden">
                        {history.map((payment) => (
                            <div key={payment._id} className="bg-base-200 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-primary text-lg">${payment.amount || 0}</p>
                                        <p className="text-sm text-base-content/70 capitalize">{payment.packageName || "Unknown"}</p>
                                    </div>
                                    <span className={`badge badge-sm font-semibold ${payment.status === "completed" ? "badge-success" : payment.status === "failed" ? "badge-error" : "badge-warning"}`}>
                                        {payment.status || "pending"}
                                    </span>
                                </div>
                                <p className="text-xs text-base-content/60">
                                    {payment.paymentDate
                                        ? new Date(payment.paymentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                        : "—"}
                                </p>
                                <div className="flex gap-2 pt-2">
                                    <button className="btn btn-xs btn-outline flex-1" onClick={() => setSelectedPayment(payment)}>
                                        Details
                                    </button>
                                    <button
                                        className="btn btn-xs btn-error flex-1"
                                        disabled={deletingId === payment._id}
                                        onClick={() => handleDelete(payment._id)}
                                    >
                                        {deletingId === payment._id ? '...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Desktop table layout */}
                {!historyLoading && history.length > 0 && (
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Package</th>
                                    <th>Amount</th>
                                    <th className="hidden md:table-cell">Transaction ID</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((payment) => (
                                    <tr key={payment._id} className="hover:bg-base-200">
                                        <td className="font-medium">
                                            {payment.paymentDate
                                                ? new Date(payment.paymentDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })
                                                : "—"}
                                        </td>
                                        <td className="capitalize font-medium">
                                            {payment.packageName || "Unknown"}
                                        </td>
                                        <td className="font-bold text-primary">
                                            ${payment.amount || 0}
                                        </td>
                                        <td className="hidden md:table-cell">
                                            <div className="tooltip" data-tip={payment.transactionId}>
                                                <code className="text-xs bg-base-300 px-3 py-1 rounded font-mono">
                                                    {payment.transactionId?.substring(0, 20)}...
                                                </code>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge badge-sm font-semibold ${payment.status === "completed" ? "badge-success" :
                                                payment.status === "failed" ? "badge-error" :
                                                    "badge-warning"
                                                }`}>
                                                {payment.status || "pending"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button className="btn btn-xs btn-outline" onClick={() => setSelectedPayment(payment)}>
                                                    Details
                                                </button>
                                                <button
                                                    className="btn btn-xs btn-error"
                                                    disabled={deletingId === payment._id}
                                                    onClick={() => handleDelete(payment._id)}
                                                >
                                                    {deletingId === payment._id ? '...' : 'Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Payment Details Modal */}
                {selectedPayment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-3">
                        <div className="bg-base-100 rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md relative">
                            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setSelectedPayment(null)}>
                                ✕
                            </button>
                            <h2 className="text-lg sm:text-xl font-bold mb-4">Payment Details</h2>
                            <div className="space-y-2 text-sm sm:text-base">
                                <div className="break-all"><span className="font-semibold">Transaction ID:</span> <code className="bg-base-200 px-2 py-1 rounded text-xs">{selectedPayment.transactionId}</code></div>
                                <div><span className="font-semibold">Package:</span> {selectedPayment.packageName}</div>
                                <div><span className="font-semibold">Amount:</span> ${selectedPayment.amount}</div>
                                <div><span className="font-semibold">Status:</span> <span className={`badge ${selectedPayment.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>{selectedPayment.status}</span></div>
                                <div><span className="font-semibold">Date:</span> {selectedPayment.paymentDate ? new Date(selectedPayment.paymentDate).toLocaleString() : '—'}</div>
                                <div><span className="font-semibold">Email:</span> {selectedPayment.email}</div>
                                <button
                                    className="btn btn-error btn-sm mt-4 w-full"
                                    disabled={deletingId === selectedPayment._id}
                                    onClick={() => handleDelete(selectedPayment._id)}
                                >
                                    {deletingId === selectedPayment._id ? 'Deleting...' : 'Delete Transaction'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Payments;
