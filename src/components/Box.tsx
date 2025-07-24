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
    borderTopRightRadius?: number;
    borderBottomRightRadius?: number;
    borderTopLeftRadius?: number;
    borderBottomLeftRadius?: number;
    borderColor?: string;
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
    borderTopRightRadius,
    borderBottomRightRadius,
    borderTopLeftRadius,
    borderBottomLeftRadius,
    borderColor,
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
    const baseClasses = 'block';

    const positionClass = position ? `${position}` : '';

    const computedStyle: React.CSSProperties = {
        ...style,
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderWidth: borderWidth ? `${borderWidth}px` : undefined,
        borderTopWidth: borderTopWidth ? `${borderTopWidth}px` : undefined,
        borderLeftWidth: borderLeftWidth ? `${borderLeftWidth}px` : undefined,
        borderRightWidth: borderRightWidth ? `${borderRightWidth}px` : undefined,
        borderBottomWidth: borderBottomWidth ? `${borderBottomWidth}px` : undefined,
        borderStyle: (borderWidth || borderTopWidth || borderLeftWidth || borderRightWidth || borderBottomWidth) ? 'solid' : undefined,
        borderTopRightRadius: borderTopRightRadius ? `${borderTopRightRadius}px` : undefined,
        borderBottomRightRadius: borderBottomRightRadius ? `${borderBottomRightRadius}px` : undefined,
        borderTopLeftRadius: borderTopLeftRadius ? `${borderTopLeftRadius}px` : undefined,
        borderBottomLeftRadius: borderBottomLeftRadius ? `${borderBottomLeftRadius}px` : undefined,
        borderColor,
        paddingLeft: px ? `${px * 4}px` : undefined, // Chakra uses 4px per unit
        paddingRight: px ? `${px * 4}px` : undefined,
        paddingTop: py ? `${py * 4}px` : undefined,
        paddingBottom: py ? `${py * 4}px` : undefined,
        gap: gap ? `${gap * 4}px` : undefined,
        position,
        color,
        fontSize,
        fontWeight,
        textAlign,
        pointerEvents,
    };

    return (
        <div
            ref={ref}
            className={`${baseClasses} ${positionClass} ${className}`}
            style={computedStyle}
            {...props}
        >
            {children}
        </div>
    );
});

Box.displayName = 'Box';
