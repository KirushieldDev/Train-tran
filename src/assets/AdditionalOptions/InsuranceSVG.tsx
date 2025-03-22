import React, { SVGProps } from "react";

const InsuranceSVG: React.FC<SVGProps<any>> = ({ className = "" }) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M10 17.5C10 17.5 15.8333 14.1667 15.8333 10V4.58333L10 2.5L4.16667 4.58333V10C4.16667 14.1667 10 17.5 10 17.5Z"
            stroke="#9CA3AF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M7.5 9.99999L9.16667 11.6667L12.9167 7.91666"
            stroke="#9CA3AF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default InsuranceSVG;
