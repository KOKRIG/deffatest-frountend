import React from 'react';

// Import all your section components
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import ContentSection from './sections/ContentSection';
import PricingSection from './sections/PricingSection';

const sectionComponents = {
    HeroSection,
    FeaturesSection,
    ContentSection,
    PricingSection,
};

const SectionRenderer = ({ sections }) => {
    if (!sections) {
        return null;
    }

    return (
        <>
            {sections.map((section, index) => {
                const SectionComponent = sectionComponents[section.type];
                if (!SectionComponent) {
                    return <p>Section type not found: {section.type}</p>;
                }
                return <SectionComponent key={index} {...section} />;
            })}
        </>
    );
};

export default SectionRenderer;

