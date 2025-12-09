import React from 'react';
import Banner from '../Shared/Banner/Banner';
import FeatureCards from '../Shared/FeatureCards/FeatureCards';
import About from '../Shared/About/About';

const Home = () => {
    return (
        <div>
            <Banner/>
            <FeatureCards/>
            <About/>
        </div>
    );
};

export default Home;
