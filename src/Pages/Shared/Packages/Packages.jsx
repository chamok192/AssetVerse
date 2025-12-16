import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../Contents/AuthContext/useAuth';

const MotionDiv = motion.div;

const packages = [
    {
        name: "Basic",
        employeeLimit: 10,
        price: 5,
        features: ["Asset Tracking", "Employee Management", "Basic Support"],
        recommended: false
    },
    {
        name: "Standard",
        employeeLimit: 20,
        price: 8,
        features: ["All Basic features", "Advanced Analytics", "Priority Support"],
        recommended: true
    },
    {
        name: "Premium",
        employeeLimit: 30,
        price: 15,
        features: ["All Standard features", "Custom Branding", "24/7 Support"],
        recommended: false
    }
];

const Packages = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (user) {
            const userData = JSON.parse(localStorage.getItem('userData')) || {};
            const role = userData.role || user.role;
            if (role?.toLowerCase() === 'hr') {
                navigate('/hr/upgrade');
            } else {
                navigate('/join/hr-manager');
            }
        } else {
            navigate('/join/hr-manager');
        }
    };

    return (
        <section id="pricing" className="py-16 px-6 lg:px-16 bg-white">
            <div className="max-w-7xl mx-auto">
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-semibold text-slate-900 mb-4">
                        Choose the right plan for your team
                    </h2>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                        Flexible pricing that scales with your organization. All plans include core asset management features.
                    </p>
                </MotionDiv>

                <div className="grid gap-8 md:grid-cols-3 lg:gap-6">
                    {packages.map((pkg, idx) => (
                        <MotionDiv
                            key={pkg.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{ y: -8 }}
                            className={`relative rounded-2xl p-8 border-2 transition-all duration-300 ${
                                pkg.recommended
                                    ? 'border-blue-500 bg-blue-50 shadow-xl'
                                    : 'border-slate-200 bg-white shadow-lg hover:shadow-xl'
                            }`}
                        >
                            {pkg.recommended && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                                <div className="flex items-baseline justify-center gap-1 mb-3">
                                    <span className="text-5xl font-bold text-slate-900">${pkg.price}</span>
                                    <span className="text-slate-600">/month</span>
                                </div>
                                <p className="text-slate-600">
                                    Up to <span className="font-semibold text-slate-900">{pkg.employeeLimit} employees</span>
                                </p>
                            </div>

                            <div className="space-y-4 mb-8">
                                {pkg.features.map((feature, featureIdx) => (
                                    <div key={featureIdx} className="flex items-start gap-3">
                                        <FaCheck className="text-green-600 mt-1 shrink-0" />
                                        <span className="text-slate-700">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleGetStarted}
                                className={`btn w-full normal-case cursor-pointer ${
                                    pkg.recommended
                                        ? 'btn-primary'
                                        : 'btn-outline'
                                }`}
                            >
                                Get Started
                            </button>
                        </MotionDiv>
                    ))}
                </div>

                <MotionDiv
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 text-center"
                >
                    <p className="text-slate-600">
                        Need a custom solution for your enterprise? 
                        <a href="#" className="text-blue-600 font-semibold hover:underline ml-1">
                            Contact our sales team
                        </a>
                    </p>
                </MotionDiv>
            </div>
        </section>
    );
};

export default Packages;
