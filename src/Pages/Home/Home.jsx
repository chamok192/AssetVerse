import React from 'react';
import Banner from '../Shared/Banner/Banner';
import FeatureCards from '../Shared/FeatureCards/FeatureCards';
import About from '../Shared/About/About';
import Features from '../Shared/Features/Features';
import Packages from '../Shared/Packages/Packages';
import Testimonials from '../Shared/Testimonials/Testimonials';
import HowItWorks from '../Shared/HowItWorks/HowItWorks';
import FAQ from '../Shared/FAQ/FAQ';

const Home = () => {
    return (
        <div className="w-full">
            <Banner/>
            <FeatureCards/>
            <Features />
            <About/>
            <Packages/>
            <Testimonials/>
            <HowItWorks/>
            <FAQ/>
        </div>
    );
};

export default Home;
