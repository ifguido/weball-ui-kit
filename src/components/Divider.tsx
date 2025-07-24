import React from 'react';

export interface DividerProps {
    className?: string;
    style?: React.CSSProperties;
    orientation?: 'horizontal' | 'vertical';
    color?: string;
}

export const Divider: React.FC<DividerProps> = ({
    className = '',
    style,
    orientation = 'horizontal',
    color = '#e2e8f0',
}) => {
    const computedStyle: React.CSSProperties = {
        ...style,
        backgroundColor: color,
        border: 'none',
        ...(orientation === 'horizontal'
            ? { width: '100%', height: '1px' }
            : { width: '1px', height: '100%' }
        ),
    };

    return (
        <hr
            className={className}
            style={computedStyle}
        />
    );
};
