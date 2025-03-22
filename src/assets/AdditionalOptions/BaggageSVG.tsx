import React, { SVGProps } from "react";

const BaggageSVG: React.FC<SVGProps<any>> = ({ className = "" }) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M13.3333 5.83333H6.66667C5.74619 5.83333 5 6.57952 5 7.5V15C5 15.9205 5.74619 16.6667 6.66667 16.6667H13.3333C14.2538 16.6667 15 15.9205 15 15V7.5C15 6.57952 14.2538 5.83333 13.3333 5.83333Z"
            stroke="#9CA3AF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M7.5 5.83333V4.16667C7.5 3.72464 7.67559 3.30072 7.98816 2.98816C8.30072 2.67559 8.72464 2.5 9.16667 2.5H10.8333C11.2754 2.5 11.6993 2.67559 12.0118 2.98816C12.3244 3.30072 12.5 3.72464 12.5 4.16667V5.83333"
            stroke="#9CA3AF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M10 9.16667V13.3333"
            stroke="#9CA3AF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M7.5 11.25H12.5"
            stroke="#9CA3AF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default BaggageSVG;
