import React from 'react';
import { motion } from 'framer-motion';
import { HiShieldCheck } from 'react-icons/hi';
import { MdSpeed, MdInsights } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';

const MotionDiv = motion.div;

const benefits = [
    {
        icon: HiShieldCheck,
        title: 'Enterprise-grade security & compliance',
        description: 'Maintain audit trails, role-based access controls, and automated compliance checks that keep your organization aligned with industry standards and internal policies.',
        color: 'text-blue-600'
    },
    {
        icon: MdSpeed,
        title: 'Accelerated asset lifecycle management',
        description: 'Streamline procurement, assignment, and retirement workflows with automated approvals and real-time tracking—reducing manual overhead by up to 60%.',
        color: 'text-green-600'
    },
    {
        icon: MdInsights,
        title: 'Data-driven insights & forecasting',
        description: 'Leverage analytics dashboards to optimize asset utilization, predict renewal cycles, and make informed budgeting decisions with confidence.',
        color: 'text-purple-600'
    },
    {
        icon: FaUsers,
        title: 'Seamless cross-team collaboration',
        description: 'Unite HR, IT, and finance teams with a single source of truth. Enable transparent communication and eliminate silos across your organization.',
        color: 'text-orange-600'
    }
];

const About = () => {
    return (
        <section className="py-16 px-6 lg:px-16 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-semibold text-slate-900 mb-4">
                        Why organizations trust AssetVerse
                    </h2>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                        Built for enterprises that demand visibility, control, and efficiency across their entire asset ecosystem.
                    </p>
                </MotionDiv>

                <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
                    {benefits.map((benefit, idx) => {
                        const Icon = benefit.icon;
                        return (
                            <MotionDiv
                                key={benefit.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`shrink-0 ${benefit.color}`}>
                                        <Icon className="text-5xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-slate-900 mb-3">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            </MotionDiv>
                        );
                    })}
                </div>

                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 text-center"
                >
                    <div className="inline-flex items-center gap-8 bg-white rounded-2xl px-8 py-6 shadow-md">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-slate-900">500+</p>
                            <p className="text-sm text-slate-600 mt-1">Organizations</p>
                        </div>
                        <div className="h-12 w-px bg-slate-300"></div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-slate-900">50k+</p>
                            <p className="text-sm text-slate-600 mt-1">Active users</p>
                        </div>
                        <div className="h-12 w-px bg-slate-300"></div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-slate-900">99.9%</p>
                            <p className="text-sm text-slate-600 mt-1">Uptime SLA</p>
                        </div>
                    </div>
                </MotionDiv>
            </div>
        </section>
    );
};

export default About;
