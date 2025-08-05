import React from 'react';

const HeroSection = (props) => {
    const { title, subtitle, button, image, theme } = props;

    const sectionStyle = {
        backgroundColor: theme?.backgroundColor,
        color: theme?.textColor,
        backgroundImage: image ? `url(${image.url})` : '''none''',
    };

    const glowEffect = theme?.glowEffect ? '''neon-glow-strong''' : '''''';

    return (
        <div data-sb-object-id={props['data-sb-object-id']} style={sectionStyle} className={`py-20 px-4 text-center bg-cover bg-center ${glowEffect}`}>
            <h1 data-sb-field-path='''.title''' className={`text-5xl font-bold ${theme?.font}`}>{title}</h1>
            {subtitle && <p data-sb-field-path='''.subtitle''' className="text-xl mt-4">{subtitle}</p>}
            {button && (
                <a href={button.url} data-sb-field-path='''.button''' className="mt-8 inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-bold text-white transition-all transform hover:scale-105">
                    {button.text}
                </a>
            )}
        </div>
    );
};

export default HeroSection;

