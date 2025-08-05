import React from 'react';
import ReactMarkdown from 'react-markdown';

const ContentSection = (props) => {
    const { title, content, theme } = props;

    const sectionStyle = {
        backgroundColor: theme?.backgroundColor,
        color: theme?.textColor,
    };

    return (
        <div data-sb-object-id={props['data-sb-object-id']} style={sectionStyle} className={`py-20 px-4`}>
            <div className="max-w-7xl mx-auto">
                <h2 data-sb-field-path='.title' className={`text-4xl font-bold ${theme?.font}`}>{title}</h2>
                <div data-sb-field-path='.content' className="mt-4 prose lg:prose-xl">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default ContentSection;

