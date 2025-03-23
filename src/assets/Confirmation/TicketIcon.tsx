import React from 'react';

const TicketIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M2 7C2 6.46957 2.21071 5.96086 2.58579 5.58579C2.96086 5.21071 3.46957 5 4 5H20C20.5304 5 21.0391 5.21071 21.4142 5.58579C21.7893 5.96086 22 6.46957 22 7V9C21.4696 9 20.9609 9.21071 20.5858 9.58579C20.2107 9.96086 20 10.4696 20 11C20 11.5304 20.2107 12.0391 20.5858 12.4142C20.9609 12.7893 21.4696 13 22 13V15C22 15.5304 21.7893 16.0391 21.4142 16.4142C21.0391 16.7893 20.5304 17 20 17H4C3.46957 17 2.96086 16.7893 2.58579 16.4142C2.21071 16.0391 2 15.5304 2 15V13C2.53043 13 3.03914 12.7893 3.41421 12.4142C3.78929 12.0391 4 11.5304 4 11C4 10.4696 3.78929 9.96086 3.41421 9.58579C3.03914 9.21071 2.53043 9 2 9V7Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9 9H12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9 13H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default TicketIcon;
