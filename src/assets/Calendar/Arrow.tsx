interface ArrowProps {
    width?: number;
    height?: number;
    color?: string;
    className?: string;
}

const Arrow = ({ width = 10, height = 16, color = "#4B5563", className = "" }: ArrowProps) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 10 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M0.293701 7.29377C-0.0969238 7.6844 -0.0969238 8.31877 0.293701 8.7094L6.2937 14.7094C6.68433 15.1 7.3187 15.1 7.70933 14.7094C8.09995 14.3188 8.09995 13.6844 7.70933 13.2938L2.41558 8.00002L7.7062 2.70627C8.09683 2.31565 8.09683 1.68127 7.7062 1.29065C7.31558 0.900024 6.6812 0.900024 6.29058 1.29065L0.290576 7.29065L0.293701 7.29377Z"
                fill={color}
            />
        </svg>
    );
};

export default Arrow;
