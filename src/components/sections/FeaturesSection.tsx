import React from 'react';

const FeaturesSection = (props) => {
    const { title, subtitle, features, theme } = props;

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
                    {features.map((feature, index) => (
                        <div key={index} data-sb-field-path={`.features.${index}`}>
                            <div className="text-center">
                                {feature.icon && <div data-sb-field-path='.icon' className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">{feature.icon}</div>}
                                <h3 data-sb-field-path='.title' className="text-xl font-bold mt-4">{feature.title}</h3>
                                <p data-sb-field-path='.description' className="mt-2">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;

