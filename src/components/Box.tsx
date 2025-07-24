import React, { forwardRef } from 'react';

export interface BoxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
    children?: React.ReactNode;
    className?: string;
    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
    width?: string | number;
    height?: string | number;
    borderWidth?: number;
    borderTopWidth?: number;
    borderLeftWidth?: number;
    borderRightWidth?: number;
    borderBottomWidth?: number;
    borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
    borderTopRightRadius?: number;
    borderBottomRightRadius?: number;
    borderTopLeftRadius?: number;
    borderBottomLeftRadius?: number;
    borderColor?: string;
    backgroundColor?: string;
    px?: number;
    py?: number;
    gap?: number;
    color?: string;
    fontSize?: string;
    fontWeight?: number;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    pointerEvents?: 'auto' | 'none';
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(({
    children,
    className = '',
    position,
    width,
    height,
    borderWidth,
    borderTopWidth,
    borderLeftWidth,
    borderRightWidth,
    borderBottomWidth,
    borderStyle,
    borderTopRightRadius,
    borderBottomRightRadius,
    borderTopLeftRadius,
    borderBottomLeftRadius,
    borderColor,
    backgroundColor,
    px,
    py,
    gap,
    color,
    fontSize,
    fontWeight,
    textAlign,
    pointerEvents,
    style,
    ...props
}, ref) => {
    const computedStyle: React.CSSProperties = {
        display: 'block', // Chakra UI always sets display: block
        boxSizing: 'border-box', // Chakra UI default
        ...style,
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,

        // Border handling - exact Chakra UI behavior
        ...(borderWidth && {
            borderWidth: `${borderWidth}px`,
            borderStyle: borderStyle || 'solid',
            borderColor: borderColor || 'currentColor',
        }),

        // Individual border widths
        ...(borderTopWidth && {
            borderTopWidth: `${borderTopWidth}px`,
            borderTopStyle: borderStyle || 'solid',
            borderTopColor: borderColor || 'currentColor',
        }),
        ...(borderLeftWidth && {
            borderLeftWidth: `${borderLeftWidth}px`,
            borderLeftStyle: borderStyle || 'solid',
            borderLeftColor: borderColor || 'currentColor',
        }),
        ...(borderRightWidth && {
            borderRightWidth: `${borderRightWidth}px`,
            borderRightStyle: borderStyle || 'solid',
            borderRightColor: borderColor || 'currentColor',
        }),
        ...(borderBottomWidth && {
            borderBottomWidth: `${borderBottomWidth}px`,
            borderBottomStyle: borderStyle || 'solid',
            borderBottomColor: borderColor || 'currentColor',
        }),

        // Border radius
        borderTopRightRadius: borderTopRightRadius ? `${borderTopRightRadius}px` : undefined,
        borderBottomRightRadius: borderBottomRightRadius ? `${borderBottomRightRadius}px` : undefined,
        borderTopLeftRadius: borderTopLeftRadius ? `${borderTopLeftRadius}px` : undefined,
        borderBottomLeftRadius: borderBottomLeftRadius ? `${borderBottomLeftRadius}px` : undefined,
        borderLeft: 0,
        // Background
        backgroundColor,

        // Spacing - Chakra UI behavior
        paddingLeft: px ? `${px * 4}px` : undefined,
        paddingRight: px ? `${px * 4}px` : undefined,
        paddingTop: py ? `${py * 4}px` : undefined,
        paddingBottom: py ? `${py * 4}px` : undefined,
        gap: gap ? `${gap * 4}px` : undefined,

        // Layout
        position,

        // Typography
        color,
        fontSize,
        fontWeight,
        textAlign,

        // Interaction
        pointerEvents,
    };

    return (
        <div
            ref={ref}
            className={className}
            style={computedStyle}
            {...props}
        >
            {children}
        </div>
    );
});

Box.displayName = 'Box';
