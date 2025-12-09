import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const faqs = [
    {
        question: 'How quickly can we get started with AssetVerse?',
        answer: 'You can set up your account and start managing assets within 15 minutes. Our intuitive onboarding process guides you through adding team members, configuring workflows, and importing existing asset data.'
    },
    {
        question: 'What types of assets can we track?',
        answer: 'AssetVerse supports all types of physical and digital assets including IT equipment (laptops, monitors, phones), office furniture, vehicles, software licenses, and more. You can create custom asset categories to fit your specific needs.'
    },
    {
        question: 'How does the approval workflow system work?',
        answer: 'Our intelligent workflow system automatically routes asset requests to the appropriate approvers based on your organizational hierarchy. You can set up multi-level approvals, parallel approvals, and conditional routing based on asset type or value.'
    },
    {
        question: 'Is my data secure?',
        answer: 'Absolutely. We use bank-level 256-bit SSL encryption, regular security audits, and comply with SOC 2 Type II and ISO 27001 standards. Your data is backed up daily and stored in secure, redundant data centers.'
    },
    {
        question: 'Can AssetVerse integrate with our existing tools?',
        answer: 'Yes! AssetVerse integrates with popular HR systems, accounting software like QuickBooks, communication tools like Slack and Microsoft Teams, and offers a REST API for custom integrations.'
    },
    {
        question: 'What kind of reports and analytics are available?',
        answer: 'AssetVerse provides comprehensive reports including asset utilization rates, depreciation tracking, cost analysis, compliance reports, and custom dashboards. You can schedule automated reports to be sent to stakeholders.'
    },
    {
        question: 'Do you offer training and support?',
        answer: 'Yes! All plans include access to our knowledge base, video tutorials, and email support. Standard and Premium plans also include live chat support and dedicated onboarding assistance.'
    },
    {
        question: 'Can we try AssetVerse before committing?',
        answer: 'Absolutely! We offer a 14-day free trial with full access to all features. No credit card required. Our team is also available for a personalized demo to show you how AssetVerse can work for your organization.'
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 px-6 lg:px-16 bg-white">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-semibold text-slate-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-slate-600">
                        Everything you need to know about AssetVerse
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div 
                            key={index}
                            className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-slate-50 transition-colors"
                            >
                                <h3 className="text-lg font-semibold text-slate-900 pr-8">
                                    {faq.question}
                                </h3>
                                {openIndex === index ? (
                                    <FaChevronUp className="text-slate-600 shrink-0" />
                                ) : (
                                    <FaChevronDown className="text-slate-600 shrink-0" />
                                )}
                            </button>
                            
                            {openIndex === index && (
                                <div className="px-6 pb-6 bg-slate-50">
                                    <p className="text-slate-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-slate-600 mb-4">
                        Still have questions?
                    </p>
                    <a href="#contact" className="text-blue-600 hover:text-blue-700 font-semibold">
                        Contact our support team →
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
