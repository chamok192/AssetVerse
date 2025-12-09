import React from 'react';
import Banner from '../Shared/Banner/Banner';
import FeatureCards from '../Shared/FeatureCards/FeatureCards';
import About from '../Shared/About/About';
import Features from '../Shared/Features/Features';
import Packages from '../Shared/Packages/Packages';
import Testimonials from '../Shared/Testimonials/Testimonials';

const Home = () => {
    return (
        <div className="w-full">
            <Banner/>
            <FeatureCards/>
            <Features />
            <About/>
            <Packages/>
            <Testimonials/>
        </div>
    );
};

export default Home;
