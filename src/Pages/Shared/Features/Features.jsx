import { MdDashboard, MdCheckCircle, MdNotifications, MdAnalytics, MdSecurity, MdSync } from 'react-icons/md';

const features = [
    {
        icon: MdDashboard,
        title: 'Intuitive Dashboard',
        description: 'Real-time visibility of all assets, requests, and workflows in one centralized command center.',
        color: 'bg-blue-100 text-blue-600'
    },
    {
        icon: MdCheckCircle,
        title: 'Smart Approval Workflows',
        description: 'Automated request routing and approval chains that respect your organizational hierarchy.',
        color: 'bg-green-100 text-green-600'
    },
    {
        icon: MdNotifications,
        title: 'Instant Notifications',
        description: 'Real-time alerts for asset status changes, pending approvals, and critical updates.',
        color: 'bg-purple-100 text-purple-600'
    },
    {
        icon: MdAnalytics,
        title: 'Advanced Analytics',
        description: 'Detailed reports and insights on asset lifecycle, utilization rates, and cost optimization.',
        color: 'bg-orange-100 text-orange-600'
    },
    {
        icon: MdSecurity,
        title: 'Bank-Level Security',
        description: 'Enterprise-grade encryption, access controls, and comprehensive audit logs for compliance.',
        color: 'bg-red-100 text-red-600'
    },
    {
        icon: MdSync,
        title: 'Seamless Integrations',
        description: 'Connect with your existing HR systems, accounting software, and communication tools.',
        color: 'bg-teal-100 text-teal-600'
    }
];

const Features = () => {
    return (
        <section className="py-20 px-6 lg:px-16 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-semibold text-slate-900 mb-4">
                        Powerful Features Built for You
                    </h2>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                        Everything you need to manage assets efficiently, from tracking to analytics.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div 
                                key={feature.title}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${feature.color} mb-6`}>
                                    <Icon className="text-3xl" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                
                <div className="text-center">
                    <p className="text-slate-700 text-lg mb-6">
                        Ready to simplify asset management?
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="#pricing" className="btn btn-primary normal-case">
                            Start Free Trial
                        </a>
                        <a href="#" className="btn btn-outline normal-case">
                            View Documentation
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
