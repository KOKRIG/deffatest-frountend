import React from 'react';

const PricingSection = (props) => {
    const { title, subtitle, plans, theme } = props;

    const sectionStyle = {
        backgroundColor: theme?.backgroundColor,
        color: theme?.textColor,
    };

    return (
        <div data-sb-object-id={props['data-sb-object-id']} style={sectionStyle} className={`py-20 px-4`}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 data-sb-field-path='.title' className={`text-4xl font-bold ${theme?.font}`}>{title}</h2>
                    {subtitle && <p data-sb-field-path='.subtitle' className="mt-4 text-lg">{subtitle}</p>}
                </div>
                <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan, index) => (
                        <div key={index} data-sb-field-path={`.plans.${index}`} className={`border-2 rounded-xl p-8 text-center ${plan.isMostPopular ? 'border-purple-500' : 'border-gray-700'}`}>
                            {plan.isMostPopular && <span className="inline-block bg-purple-500 text-white text-xs font-bold rounded-full px-3 py-1 uppercase">Most Popular</span>}
                            <h3 data-sb-field-path='.name' className="text-2xl font-bold mt-4">{plan.name}</h3>
                            <div data-sb-field-path='.price' className="text-5xl font-bold mt-4">{plan.price}</div>
                            <p data-sb-field-path='.period' className="text-sm text-gray-400">{plan.period}</p>
                            <ul data-sb-field-path='.features' className="mt-8 space-y-4">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} data-sb-field-path={`.${featureIndex}`} className="flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            {plan.button && (
                                <a href={plan.button.url} data-sb-field-path='.button' className="mt-8 inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-bold text-white transition-all transform hover:scale-105">
                                    {plan.button.text}
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PricingSection;

