import React from 'react';

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                fill="#059669"
                fillOpacity="0.2"
            />
            <path
                d="M16.5 8.5L10.5 14.5L7.5 11.5"
                stroke="#059669"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default CheckCircleIcon;
