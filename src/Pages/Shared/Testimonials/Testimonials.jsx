
import { FaStar, FaQuoteLeft, FaMicrosoft, FaGoogle, FaAmazon, FaApple, FaSlack, FaDropbox, FaSpotify, FaStripe } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { SiNetflix, SiAdobe, SiSalesforce, SiShopify } from 'react-icons/si';

const testimonials = [
    {
        name: 'Sarah Johnson',
        role: 'HR Director',
        company: 'TechCorp Solutions',
        image: 'https://i.pravatar.cc/150?img=1',
        rating: 5,
        text: 'AssetVerse transformed how we manage our IT assets. The approval workflows alone saved us 15 hours per week. Highly recommended for growing companies!'
    },
    {
        name: 'Michael Chen',
        role: 'IT Manager',
        company: 'GlobalTech Industries',
        image: 'https://i.pravatar.cc/150?img=12',
        rating: 5,
        text: 'Best asset management platform we\'ve used. The analytics dashboard gives us real-time insights we never had before. ROI was visible within the first month.'
    },
    {
        name: 'Emily Rodriguez',
        role: 'Operations Lead',
        company: 'Innovate Digital',
        image: 'https://i.pravatar.cc/150?img=5',
        rating: 5,
        text: 'Seamless integration with our existing systems and the support team is fantastic. AssetVerse has become an essential tool for our entire organization.'
    }
];

const stats = [
    {
        value: '500+',
        label: 'Companies Trust Us',
        icon: MdVerified
    },
    {
        value: '50k+',
        label: 'Active Users',
        icon: MdVerified
    },
    {
        value: '1M+',
        label: 'Assets Tracked',
        icon: MdVerified
    },
    {
        value: '99.9%',
        label: 'Uptime Guarantee',
        icon: MdVerified
    }
];

const Testimonials = () => {
    return (
        <section className="rounded-xl py-20 px-6 lg:px-16 bg-slate-900 text-white mb-16">
            <div className="max-w-7xl mx-auto">
                {/* Stats Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-semibold mb-4">
                        Trusted by Industry Leaders
                    </h2>
                    <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-12">
                        Join hundreds of companies already streamlining their asset management with AssetVerse
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                        {stats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div key={stat.label} className="text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <Icon className="text-emerald-400 text-2xl mr-2" />
                                        <p className="text-5xl font-bold text-white">{stat.value}</p>
                                    </div>
                                    <p className="text-slate-400 text-sm">{stat.label}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="mb-12 text-center">
                    <h3 className="text-3xl font-semibold mb-4">
                        What Our Clients Say
                    </h3>
                    <p className="text-slate-300 mb-12">
                        Real feedback from real companies using AssetVerse
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial, idx) => (
                        <div 
                            key={idx}
                            className="bg-slate-800 rounded-2xl p-8 hover:bg-slate-700 transition-colors duration-300 relative"
                        >
                            <FaQuoteLeft className="text-4xl text-slate-600 mb-4" />
                            
                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <FaStar key={i} className="text-yellow-400" />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-slate-200 leading-relaxed mb-6">
                                "{testimonial.text}"
                            </p>

                            {/* Author Info */}
                            <div className="flex items-center gap-4">
                                <img 
                                    src={testimonial.image} 
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <p className="font-semibold text-white">{testimonial.name}</p>
                                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                                    <p className="text-sm text-emerald-400">{testimonial.company}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Company Logos Slider */}
                <div className="mt-16 text-center overflow-hidden">
                    <p className="text-slate-400 mb-8">Trusted by leading companies worldwide</p>
                    <div className="relative">
                        <div className="flex animate-scroll">
                            <div className="flex gap-16 items-center px-8">
                                <FaMicrosoft className="text-5xl text-slate-500 hover:text-blue-500 transition-colors cursor-pointer shrink-0" />
                                <FaGoogle className="text-5xl text-slate-500 hover:text-red-500 transition-colors cursor-pointer shrink-0" />
                                <FaAmazon className="text-5xl text-slate-500 hover:text-orange-500 transition-colors cursor-pointer shrink-0" />
                                <FaApple className="text-5xl text-slate-500 hover:text-white transition-colors cursor-pointer shrink-0" />
                                <SiNetflix className="text-5xl text-slate-500 hover:text-red-600 transition-colors cursor-pointer shrink-0" />
                                <SiAdobe className="text-5xl text-slate-500 hover:text-red-500 transition-colors cursor-pointer shrink-0" />
                                <SiSalesforce className="text-5xl text-slate-500 hover:text-blue-400 transition-colors cursor-pointer shrink-0" />
                                <FaSlack className="text-5xl text-slate-500 hover:text-purple-500 transition-colors cursor-pointer shrink-0" />
                                <FaDropbox className="text-5xl text-slate-500 hover:text-blue-600 transition-colors cursor-pointer shrink-0" />
                                <FaSpotify className="text-5xl text-slate-500 hover:text-green-500 transition-colors cursor-pointer shrink-0" />
                                <SiShopify className="text-5xl text-slate-500 hover:text-green-600 transition-colors cursor-pointer shrink-0" />
                                <FaStripe className="text-5xl text-slate-500 hover:text-purple-600 transition-colors cursor-pointer shrink-0" />
                            </div>
                            {/* Duplicate for seamless loop */}
                            <div className="flex gap-16 items-center px-8">
                                <FaMicrosoft className="text-5xl text-slate-500 hover:text-blue-500 transition-colors cursor-pointer shrink-0" />
                                <FaGoogle className="text-5xl text-slate-500 hover:text-red-500 transition-colors cursor-pointer shrink-0" />
                                <FaAmazon className="text-5xl text-slate-500 hover:text-orange-500 transition-colors cursor-pointer shrink-0" />
                                <FaApple className="text-5xl text-slate-500 hover:text-white transition-colors cursor-pointer shrink-0" />
                                <SiNetflix className="text-5xl text-slate-500 hover:text-red-600 transition-colors cursor-pointer shrink-0" />
                                <SiAdobe className="text-5xl text-slate-500 hover:text-red-500 transition-colors cursor-pointer shrink-0" />
                                <SiSalesforce className="text-5xl text-slate-500 hover:text-blue-400 transition-colors cursor-pointer shrink-0" />
                                <FaSlack className="text-5xl text-slate-500 hover:text-purple-500 transition-colors cursor-pointer shrink-0" />
                                <FaDropbox className="text-5xl text-slate-500 hover:text-blue-600 transition-colors cursor-pointer shrink-0" />
                                <FaSpotify className="text-5xl text-slate-500 hover:text-green-500 transition-colors cursor-pointer shrink-0" />
                                <SiShopify className="text-5xl text-slate-500 hover:text-green-600 transition-colors cursor-pointer shrink-0" />
                                <FaStripe className="text-5xl text-slate-500 hover:text-purple-600 transition-colors cursor-pointer shrink-0" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
