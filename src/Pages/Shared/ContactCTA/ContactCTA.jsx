import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ContactCTA = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        company: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setFormData({ fullName: '', email: '', company: '', message: '' });
    };
    return (
        <section id="contact" className="rounded-xl py-20 px-6 lg:px-16 bg-slate-900 text-white mb-16">
            <div className="max-w-7xl mx-auto">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            Ready to Transform Your Asset Management?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                            Join 500+ companies already streamlining their operations with AssetVerse. Start your free trial today or schedule a personalized demo.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Link 
                                to="/join/hr-manager" 
                                className="btn btn-lg bg-white text-blue-600 hover:bg-slate-100 border-0 normal-case"
                            >
                                Start Free Trial
                            </Link>
                            <a 
                                href="#" 
                                className="btn btn-lg btn-outline border-2 border-white text-white hover:bg-white hover:text-blue-600 normal-case"
                            >
                                Schedule Demo
                            </a>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                    <FaEnvelope className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-blue-100">Email us</p>
                                    <a href="mailto:support@assetverse.com" className="text-lg font-semibold hover:underline">
                                        support@assetverse.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                    <FaPhone className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-blue-100">Call us</p>
                                    <a href="tel:+1234567890" className="text-lg font-semibold hover:underline">
                                        +1 (234) 567-890
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                    <FaMapMarkerAlt className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-blue-100">Visit us</p>
                                    <p className="text-lg font-semibold">
                                        123 Business Ave
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-2xl">
                        <h3 className="text-2xl font-semibold text-slate-900 mb-6">
                            Get in Touch
                        </h3>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Full Name
                                </label>
                                <input 
                                    type="text" 
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="input input-bordered w-full bg-slate-50 text-slate-900" 
                                    placeholder="Your Name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input input-bordered w-full bg-slate-50 text-slate-900" 
                                    placeholder="email@company.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Company Name
                                </label>
                                <input 
                                    type="text" 
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="input input-bordered w-full bg-slate-50 text-slate-900" 
                                    placeholder="Your Company"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Message
                                </label>
                                <textarea 
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="textarea textarea-bordered w-full bg-slate-50 text-slate-900 h-32" 
                                    placeholder="Tell us about your needs..."
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary w-full btn-lg normal-case"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactCTA;
