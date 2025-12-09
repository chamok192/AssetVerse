import React from 'react';
import Banner from '../Shared/Banner/Banner';
import FeatureCards from '../Shared/FeatureCards/FeatureCards';
import About from '../Shared/About/About';
import Packages from '../Shared/Packages/Packages';

const Home = () => {
    return (
        <div>
            <Banner/>
            <FeatureCards/>
            <About/>
            <Packages/>
        </div>
    );
};

export default Home;
