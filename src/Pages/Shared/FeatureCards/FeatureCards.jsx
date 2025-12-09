import React from 'react';
import { motion } from 'framer-motion';

const MotionArticle = motion.article;

const featureCards = [
    {
        title: 'Unified inventory control',
        description: 'Track hardware, software, and licenses in one live command center with audit-ready trails.',
        badge: 'Live sync'
    },
    {
        title: 'Role-aware workflows',
        description: 'Route requests to HR managers, notify employees, and keep handoffs clean and documented.',
        badge: 'Workflow'
    },
    {
        title: 'Risk & compliance ready',
        description: 'Lifecycle checkpoints for procurement, assignment, returns, and renewals keep you compliant.',
        badge: 'Governance'
    }
];

const FeatureCards = () => {
    return (
        <section className="grid gap-6 lg:grid-cols-3 px-6 py-16 sm:px-12 lg:px-16">
            {featureCards.map((feature, idx) => (
                <MotionArticle
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)' }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="h-full rounded-2xl border border-slate-200/60 bg-white p-6 shadow-lg shadow-slate-200/60 cursor-pointer"
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-semibold">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                        {feature.badge}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                    <p className="mt-3 text-slate-600">{feature.description}</p>
                </MotionArticle>
            ))}
        </section>
    );
};

export default FeatureCards;
