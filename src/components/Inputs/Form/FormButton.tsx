import * as React from "react";

interface FormButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    className?: string;
}

export const FormButton: React.FC<FormButtonProps> = ({
                                                          children,
                                                          onClick,
                                                          type = "button",
                                                          className = "",
                                                      }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`w-full px-4 py-3 bg-primary text-white text-base font-medium rounded-lg hover:bg-primary/80 transition-colors ${className}`}
        >
            {children}
        </button>
    );
};
