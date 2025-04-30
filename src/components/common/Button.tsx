import React, {ButtonHTMLAttributes, ReactNode} from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
    children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    size = "md",
    fullWidth = false,
    icon,
    iconPosition = "left",
    children,
    className = "",
    ...props
}) => {
    // Base classes
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-colors";

    // Variant classes
    const variantClasses = {
        primary: "bg-[#059669] text-white hover:bg-[#059669]/90",
        secondary: "bg-primary text-white hover:bg-primary/90",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    };

    // Size classes
    const sizeClasses = {
        sm: "text-xs py-2 px-3",
        md: "text-sm py-2.5 px-4",
        lg: "text-base py-3.5 px-6",
    };

    // Width class
    const widthClass = fullWidth ? "w-full" : "";

    // Combine all classes
    const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

    return (
        <button className={buttonClasses} {...props}>
            {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
            {children}
            {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
        </button>
    );
};

export default Button;
