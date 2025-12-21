import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getPaymentHistory, verifyPaymentSession } from "../Services/api";

const Payments = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const paymentSuccess = searchParams.get('payment') === 'success';
    const sessionId = searchParams.get('session_id');
    const [showSuccessNotification, setShowSuccessNotification] = useState(paymentSuccess);
    const [isVerifying, setIsVerifying] = useState(false);

    const { data: history = [], isLoading: historyLoading, refetch } = useQuery({
        queryKey: ['paymentHistory'],
        queryFn: async () => {
            const result = await getPaymentHistory();
            return result.success ? (Array.isArray(result.data) ? result.data : []) : [];
        }
    });

    // Verify session and process payment if needed
    useEffect(() => {
        if (!sessionId || isVerifying) return;
        
        const verifyAndRefetch = async () => {
            setIsVerifying(true);
            try {
                const result = await verifyPaymentSession(sessionId);
                
                if (result.success) {
                    // Wait a bit and refetch payment history
                    await new Promise(resolve => setTimeout(resolve, 500));
                    await refetch();
                    // Clear session_id from URL but keep payment=success
                    setSearchParams({ payment: 'success' });
                }
            } catch (error) {
                console.error('Error verifying session:', error);
            } finally {
                setIsVerifying(false);
            }
        };
        
        verifyAndRefetch();
    }, [sessionId, isVerifying, refetch, setSearchParams]);

    // Auto-hide notification after 5 seconds
    useEffect(() => {
        if (!showSuccessNotification) return;
        
        const timer = setTimeout(() => setShowSuccessNotification(false), 5000);
        return () => clearTimeout(timer);
    }, [showSuccessNotification]);

    return (
        <div className="min-h-screen bg-base-200 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Payment History</h1>
                    <p className="text-base-content/60">View all your payment transactions and subscription details.</p>
                </div>

                {showSuccessNotification && (
                    <div className="alert alert-success shadow-lg mb-6 animate-bounce">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold">Payment Successful! Your package has been upgraded.</span>
                        </div>
                    </div>
                )}

                <div className="rounded-lg bg-base-100 p-6 shadow">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold">All Transactions</h3>
                        <span className="text-sm text-base-content/60">{history.length} payments</span>
                    </div>

                    {historyLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-base-content/60 mb-4">No payments yet</p>
                            <a href="/hr/upgrade" className="link link-primary">Go to Upgrade Package</a>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Package</th>
                                        <th>Amount</th>
                                        <th>Transaction ID</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((payment) => (
                                        <tr key={payment._id}>
                                            <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                                            <td className="font-medium">{payment.packageName}</td>
                                            <td className="font-semibold">${payment.amount}</td>
                                            <td>
                                                <span title={payment.transactionId} className="cursor-help">
                                                    {payment.transactionId.substring(0, 12)}...
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${
                                                    payment.status === 'completed' ? 'badge-success' : 'badge-warning'
                                                }`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payments;
