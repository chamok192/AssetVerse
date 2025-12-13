import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createCheckoutSession, getPaymentHistory } from "../../Services/api";
import DashboardLayout from "./DashboardLayout";

const packages = [
    { id: "basic", name: "Basic", price: 5, employeeLimit: 5, features: ["Asset Tracking", "Employee Management", "Basic Support"] },
    { id: "standard", name: "Standard", price: 8, employeeLimit: 10, features: ["All Basic features", "Advanced Analytics", "Priority Support"] },
    { id: "premium", name: "Premium", price: 15, employeeLimit: 20, features: ["All Standard features", "Custom Branding", "24/7 Support"] }
];

const UpgradePackage = () => {
    const [error, setError] = useState("");

    // Fetch payment history using TanStack Query
    const { data: history = [], isLoading: historyLoading } = useQuery({
        queryKey: ['paymentHistory'],
        queryFn: async () => {
            const result = await getPaymentHistory();
            return result.success ? (Array.isArray(result.data) ? result.data : []) : [];
        }
    });

    // Mutation for creating checkout session
    const checkoutMutation = useMutation({
        mutationFn: createCheckoutSession,
        onSuccess: (result) => {
            if (result.success && result.data?.url) {
                window.location.assign(result.data.url);
            } else {
                setError(result.error || "Unable to start checkout");
            }
        },
        onError: (err) => {
            setError(err?.message || "Failed to create checkout session");
        }
    });

    const startCheckout = (pkgId) => {
        setError("");
        checkoutMutation.mutate(pkgId);
    };

    return (
        <DashboardLayout
            title="Upgrade"
            subtitle="Choose a plan and pay securely with Stripe. Limits update immediately after success."
        >
            {(error || checkoutMutation.error) && (
                <div className="alert alert-error shadow">
                    <span>{error || checkoutMutation.error?.message || "Failed to process checkout"}</span>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-3">
                {packages.map((pkg) => (
                    <div key={pkg.id} className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title">{pkg.name}</h2>
                            <p className="text-3xl font-bold">${pkg.price}<span className="text-base text-base-content/60">/mo</span></p>
                            <p className="text-sm text-base-content/70">Employee limit: {pkg.employeeLimit}</p>
                            <ul className="mt-3 space-y-1 text-sm text-base-content/80">
                                {pkg.features.map((f) => (
                                    <li key={f}>• {f}</li>
                                ))}
                            </ul>
                            <button
                                type="button"
                                className="btn btn-primary mt-4"
                                onClick={() => startCheckout(pkg.id)}
                                disabled={checkoutMutation.isPending}
                            >
                                {checkoutMutation.isPending ? "Processing..." : "Pay with Stripe"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-box bg-base-100 p-4 shadow">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Payment History</h3>
                    <span className="text-sm text-base-content/70">Most recent first</span>
                </div>
                <div className="overflow-x-auto mt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Package</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyLoading && (
                                <tr>
                                    <td colSpan={4} className="py-4 text-center">
                                        <span className="loading loading-spinner"></span>
                                    </td>
                                </tr>
                            )}
                            {!historyLoading && history.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-4 text-center text-base-content/70">No payments yet.</td>
                                </tr>
                            )}
                            {!historyLoading && history.map((payment) => (
                                <tr key={payment._id}>
                                    <td>{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "-"}</td>
                                    <td className="capitalize">{payment.package || payment.packageId}</td>
                                    <td>${payment.amount || payment.total || 0}</td>
                                    <td>
                                        <span className={`badge ${payment.status === "paid" ? "badge-success" : "badge-ghost"}`}>
                                            {payment.status || "pending"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UpgradePackage;
