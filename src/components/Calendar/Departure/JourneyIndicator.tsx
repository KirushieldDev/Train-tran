import * as React from "react";

interface JourneyIndicatorProps {
    children: React.ReactNode;
}

export const JourneyIndicator: React.FC<JourneyIndicatorProps> = ({children}) => {
    return (
        <div className="flex gap-2 items-center my-auto">
            <div className="flex shrink-0 self-stretch my-auto w-16 h-0.5 bg-gray-300" />
            <div className="flex overflow-hidden justify-center items-center self-stretch min-h-4">{children}</div>
            <div className="flex shrink-0 self-stretch my-auto w-16 h-0.5 bg-gray-300" />
        </div>
    );
};
