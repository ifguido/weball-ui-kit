import React, { useState } from 'react';

export interface TooltipProps {
    children: React.ReactNode;
    label: string;
    className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
    children,
    label,
    className = '',
}) => {
    const [isVisible, setIsVisible] = useState(false);

    if (!label) {
        return <>{children}</>;
    }

    return (
        <div
            className={`relative inline-block ${className}`}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div
                    className="absolute z-10 px-2 py-1 text-xs text-white bg-gray-900 rounded-md whitespace-nowrap"
                    style={{
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginBottom: '4px',
                    }}
                >
                    {label}
                    <div
                        className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"
                    />
                </div>
            )}
        </div>
    );
};
