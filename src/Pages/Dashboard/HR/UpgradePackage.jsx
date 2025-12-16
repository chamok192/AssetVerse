import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPaymentHistory } from "../../../Services/api";
import { useAuth } from "../../../Contents/AuthContext/useAuth.js";
import PaymentModal from "../../../Components/PaymentModal";
import DashboardLayout from "./DashboardLayout";

const packages = [
    { id: "basic", name: "Basic", price: 5, employeeLimit: 10, features: ["Asset Tracking", "Employee Management", "Basic Support"] },
    { id: "standard", name: "Standard", price: 8, employeeLimit: 20, features: ["All Basic features", "Advanced Analytics", "Priority Support"] },
    { id: "premium", name: "Premium", price: 15, employeeLimit: 30, features: ["All Standard features", "Custom Branding", "24/7 Support"] }
];

const UpgradePackage = () => {
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();

    const { data: history = [], isLoading: historyLoading, refetch: refetchHistory } = useQuery({
        queryKey: ['paymentHistory'],
        queryFn: async () => {
            const result = await getPaymentHistory();
            return result.success ? (Array.isArray(result.data) ? result.data : []) : [];
        }
    });

    const openPaymentModal = (pkg) => {
        setSelectedPackage(pkg);
        setIsModalOpen(true);
    };

    const handlePaymentSuccess = () => {
        setIsModalOpen(false);
        setSelectedPackage(null);
        refetchHistory();
    };

    return (
        <DashboardLayout
            title="Upgrade Package"
            subtitle="Choose a plan and upgrade your account. Payment updates your employee limit immediately."
        >
            <div className="grid gap-6 md:grid-cols-3">
                {packages.map((pkg) => (
                    <div key={pkg.id} className="card bg-base-100 shadow hover:shadow-lg transition-shadow">
                        <div className="card-body">
                            <h2 className="card-title text-2xl">{pkg.name}</h2>
                            <div className="my-4">
                                <p className="text-4xl font-bold text-primary">${pkg.price}</p>
                                <p className="text-sm text-base-content/60">/month</p>
                            </div>
                            <div className="divider my-2"></div>
                            <p className="text-sm font-semibold text-base-content/70 mb-3">Employee limit: <span className="badge badge-outline">{pkg.employeeLimit}</span></p>
                            <ul className="space-y-2 text-sm mb-6 flex-grow">
                                {pkg.features.map((f) => (
                                    <li key={f} className="flex items-start">
                                        <span className="text-success mr-2 font-bold">✓</span>
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                type="button"
                                className="btn btn-primary btn-block"
                                onClick={() => openPaymentModal(pkg)}
                            >
                                Upgrade Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 rounded-lg bg-base-100 p-6 shadow">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Payment History</h3>
                    <span className="text-sm text-base-content/60">Latest transactions</span>
                </div>
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
                            {historyLoading && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8">
                                        <span className="loading loading-spinner loading-md"></span>
                                    </td>
                                </tr>
                            )}
                            {!historyLoading && history.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-base-content/60">
                                        No payments yet. Choose a package to get started!
                                    </td>
                                </tr>
                            )}
                            {!historyLoading && history.map((payment) => (
                                <tr key={payment._id}>
                                    <td>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "-"}</td>
                                    <td className="capitalize font-medium">{payment.packageName || "Unknown"}</td>
                                    <td className="font-semibold">${payment.amount || 0}</td>
                                    <td><code className="text-xs">{payment.transactionId?.substring(0, 16)}...</code></td>
                                    <td>
                                        <span className={`badge badge-sm ${
                                            payment.status === "completed" ? "badge-success" :
                                            payment.status === "failed" ? "badge-error" :
                                            "badge-warning"
                                        }`}>
                                            {payment.status || "pending"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedPackage && isModalOpen && (
                <PaymentModal 
                    isOpen={isModalOpen} 
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedPackage(null);
                    }}
                    package={selectedPackage}
                    userEmail={user?.email}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </DashboardLayout>
    );
};

export default UpgradePackage;
