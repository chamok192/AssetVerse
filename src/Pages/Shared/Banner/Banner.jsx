import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div;

const backgroundImages = [
    'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80'
];

const Banner = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
        }, 5000); 

        return () => clearInterval(interval);
    }, []);
    return (
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 text-white shadow-2xl mt-8 mx-6 lg:mx-0">
            <div className="absolute inset-0">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImageIndex}
                        src={backgroundImages[currentImageIndex]}
                        alt="Corporate workspace"
                        className="h-full w-full object-cover opacity-55"
                        initial={{ opacity: 0.2}}
                        animate={{ opacity: 0.99 }}
                        exit={{ opacity: 0.2 }}
                        transition={{ duration: 0.9 }}
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-linear-to-r from-black/85 via-neutral-950/70 to-slate-900/30" />
            </div>

            <div className="relative px-6 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
                <div className="max-w-4xl space-y-8">
                    <MotionDiv
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="space-y-5"
                    >
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur">
                            AssetVerse • Enterprise-grade control
                        </span>
                        <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                            Control every asset lifecycle in one view.
                        </h1>
                        <p className="text-lg text-white/80 sm:text-xl">
                            A single pane for HR, IT, and finance to see asset health, approvals, and compliance without losing the human touch for every employee experience.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link to="/join/employee" className="btn btn-primary btn-lg normal-case">
                                Start as employee
                            </Link>
                            <Link to="/join/hr-manager" className="btn btn-outline btn-lg text-white border-white/30 hover:border-white/60 normal-case hover:text-black">
                                For HR managers
                            </Link>
                        </div>
                    </MotionDiv>

                    <MotionDiv
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
                        className="grid gap-4 rounded-2xl bg-white/5 p-6 backdrop-blur sm:grid-cols-3"
                    >
                        {[{
                            label: 'Assets tracked',
                            value: '12.4k',
                            trend: '+18% QoQ'
                        }, {
                            label: 'Fulfillment SLA',
                            value: '92%',
                            trend: 'within 48h'
                        }, {
                            label: 'License accuracy',
                            value: '99.2%',
                            trend: 'audit ready'
                        }].map((stat) => (
                            <div key={stat.label} className="rounded-xl border border-white/10 bg-black/40 p-4">
                                <p className="text-sm text-white/70">{stat.label}</p>
                                <p className="text-3xl font-semibold leading-tight">{stat.value}</p>
                                <p className="text-sm text-emerald-300">{stat.trend}</p>
                            </div>
                        ))}
                    </MotionDiv>
                </div>
            </div>

        </section>
    );
};

export default Banner;
