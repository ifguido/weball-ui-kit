import React, { forwardRef } from 'react';

export interface TextProps {
    children?: React.ReactNode;
    className?: string;
    fontSize?: string;
    fontWeight?: string | number;
    color?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    px?: number;
    py?: number;
    height?: number | string;
    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
    pointerEvents?: 'none' | 'auto';
    as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    style?: React.CSSProperties;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    width?: string;
}

export const Text = forwardRef<HTMLElement, TextProps>(({
    children,
    className = '',
    fontSize,
    fontWeight,
    color,
    textAlign,
    px,
    py,
    height,
    position,
    pointerEvents,
    as = 'p',
    style,
    onClick,
    width,
    ...props
}, ref) => {
    const computedStyle: React.CSSProperties = {
        ...style,
        fontSize,
        fontWeight,
        color,
        textAlign,
        paddingLeft: px ? `${px * 4}px` : undefined,
        paddingRight: px ? `${px * 4}px` : undefined,
        paddingTop: py ? `${py * 4}px` : undefined,
        paddingBottom: py ? `${py * 4}px` : undefined,
        height: typeof height === 'number' ? `${height * 4}px` : height,
        position,
        pointerEvents,
        width,
    };

    const commonProps = {
        ref: ref as any,
        className,
        style: computedStyle,
        onClick,
    };

    switch (as) {
        case 'span':
            return <span {...commonProps}>{children}</span>;
        case 'div':
            return <div {...commonProps}>{children}</div>;
        case 'h1':
            return <h1 {...commonProps}>{children}</h1>;
        case 'h2':
            return <h2 {...commonProps}>{children}</h2>;
        case 'h3':
            return <h3 {...commonProps}>{children}</h3>;
        case 'h4':
            return <h4 {...commonProps}>{children}</h4>;
        case 'h5':
            return <h5 {...commonProps}>{children}</h5>;
        case 'h6':
            return <h6 {...commonProps}>{children}</h6>;
        default:
            return <p {...commonProps}>{children}</p>;
    }
});

Text.displayName = 'Text';
