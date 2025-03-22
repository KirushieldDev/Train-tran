import React, { SVGProps } from "react";

const PowerSVG: React.FC<SVGProps<any>> = ({ className = "" }) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M11.6667 2.5L4.16675 11.6667H10L8.33341 17.5L15.8334 8.33333H10L11.6667 2.5Z"
            stroke="#9CA3AF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default PowerSVG;
