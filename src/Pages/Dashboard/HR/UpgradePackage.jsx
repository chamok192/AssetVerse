import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserByEmail, getPackages } from "../../../Services/api";
import { useAuth } from "../../../Contents/AuthContext/useAuth.js";
import PaymentModal from "../../../Components/PaymentModal";
import DashboardLayout from "./DashboardLayout";

const UpgradePackage = () => {
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const { user } = useAuth();

    // Fetch packages from database
    const { data: packages = [], isLoading: packagesLoading } = useQuery({
        queryKey: ['packages'],
        queryFn: async () => {
            const result = await getPackages();
            return result.success ? (Array.isArray(result.data) ? result.data : []) : [];
        }
    });

    // Fetch current user subscription
    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.email) {
                const result = await getUserByEmail(user.email);
                if (result.success && result.data?.subscription) {
                    setCurrentSubscription(result.data.subscription);
                }
            }
        };
        fetchUserData();
    }, [user?.email]);

    const openPaymentModal = (pkg) => {
        setSelectedPackage(pkg);
        setIsModalOpen(true);
    };

    const handlePaymentSuccess = () => {
        setIsModalOpen(false);
        setSelectedPackage(null);
        // Refresh user subscription status
        if (user?.email) {
            const fetchUserData = async () => {
                const result = await getUserByEmail(user.email);
                if (result.success && result.data?.subscription) {
                    setCurrentSubscription(result.data.subscription);
                }
            };
            fetchUserData();
        }
    };

    if (packagesLoading) {
        return (
            <DashboardLayout
                title="Upgrade Package"
                subtitle="Choose a plan and upgrade your account. Payment updates your employee limit immediately."
            >
                <div className="flex justify-center items-center min-h-96">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title="Upgrade Package"
            subtitle="Choose a plan and upgrade your account. Payment updates your employee limit immediately."
        >
            <div className="grid gap-6 md:grid-cols-3">
                {packages.map((pkg) => {
                    const isActive = currentSubscription === pkg.id;
                    return (
                        <div 
                            key={pkg.id} 
                            className={`card shadow hover:shadow-lg transition-all ${
                                isActive 
                                    ? 'bg-primary text-primary-content ring-2 ring-primary' 
                                    : 'bg-base-100'
                            }`}
                        >
                            <div className="card-body">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="card-title text-2xl">{pkg.name}</h2>
                                    {isActive && (
                                        <span className="badge badge-lg badge-accent gap-2">
                                            ✓ Active
                                        </span>
                                    )}
                                </div>
                                <div className="my-4">
                                    <p className={`text-4xl font-bold ${isActive ? 'text-primary-content' : 'text-primary'}`}>
                                        ${pkg.price}
                                    </p>
                                    <p className={`text-sm ${isActive ? 'text-primary-content/80' : 'text-base-content/60'}`}>
                                        /month
                                    </p>
                                </div>
                                <div className={`divider my-2 ${isActive ? 'bg-primary-content/20' : ''}`}></div>
                                <p className={`text-sm font-semibold mb-3 ${
                                    isActive ? 'text-primary-content/90' : 'text-base-content/70'
                                }`}>
                                    Employee limit: <span className={`badge ${
                                        isActive ? 'badge-accent' : 'badge-outline'
                                    }`}>
                                        {pkg.employeeLimit}
                                    </span>
                                </p>
                                <ul className={`space-y-2 text-sm mb-6 grow ${
                                    isActive ? 'text-primary-content/95' : ''
                                }`}>
                                    {pkg.features.map((f) => (
                                        <li key={f} className="flex items-start">
                                            <span className={`mr-2 font-bold ${
                                                isActive ? 'text-accent' : 'text-success'
                                            }`}>
                                                ✓
                                            </span>
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    type="button"
                                    className={`btn btn-block ${
                                        isActive 
                                            ? 'btn-disabled btn-outline' 
                                            : 'btn-primary'
                                    }`}
                                    onClick={() => !isActive && openPaymentModal(pkg)}
                                    disabled={isActive}
                                >
                                    {isActive ? 'Current Plan' : 'Upgrade Now'}
                                </button>
                            </div>
                        </div>
                    );
                })}
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
