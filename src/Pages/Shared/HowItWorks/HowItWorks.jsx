import React from 'react';
import { FaUserPlus, FaCog, FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;

const steps = [
    {
        number: '01',
        icon: FaUserPlus,
        title: 'Sign Up & Setup',
        description: 'Create your account in minutes. Add your team members and define roles. Our intuitive onboarding gets you started instantly.',
        color: 'bg-blue-500'
    },
    {
        number: '02',
        icon: FaCog,
        title: 'Configure Workflows',
        description: 'Customize approval chains and asset categories. Set up automated notifications and integrate with your existing tools.',
        color: 'bg-purple-500'
    },
    {
        number: '03',
        icon: FaRocket,
        title: 'Start Managing',
        description: 'Begin tracking assets, processing requests, and gaining insights. Your team is now empowered with streamlined asset management.',
        color: 'bg-emerald-500'
    }
];

const HowItWorks = () => {
    return (
        <section className="py-20 px-6 lg:px-16 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-semibold text-slate-900 mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Get started with AssetVerse in three simple steps
                    </p>
                </div>

                <div className="grid gap-12 md:grid-cols-3 relative">
                    <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-20"
                        style={{ width: '80%', margin: '0 10%' }}>
                    </div>

                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <MotionDiv
                                key={step.number}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2, duration: 0.5 }}
                                className="relative text-center"
                            >
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-6xl font-bold text-slate-200">
                                    {step.number}
                                </div>

                                <div className={`relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-full ${step.color} text-white mb-6 shadow-lg`}>
                                    <Icon className="text-3xl" />
                                </div>

                                <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                                    {step.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </MotionDiv>
                        );
                    })}
                </div>

                <div className="text-center mt-16">
                    <a href="/join/hr-manager" className="btn btn-primary btn-lg normal-case">
                        Get Started Now
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
