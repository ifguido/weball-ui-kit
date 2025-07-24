import React, { forwardRef } from 'react';

export interface FlexProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
    children?: React.ReactNode;
    className?: string;
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    gap?: number;
    width?: string | number;
    height?: string | number;
    maxWidth?: string;
    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
    px?: number;
    py?: number;
    mt?: number;
    borderRadius?: number;
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    color?: string;
    fontWeight?: number;
    cursor?: string;
    zIndex?: number;
    backgroundColor?: string;
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(({
    children,
    className = '',
    direction,
    alignItems,
    justifyContent,
    gap,
    width,
    height,
    position,
    px,
    py,
    mt,
    borderRadius,
    flexDirection,
    color,
    fontWeight,
    cursor,
    zIndex,
    backgroundColor,
    style,
    ...props
}, ref) => {
    const baseClasses = 'flex';

    const directionClasses = {
        'row': 'flex-row',
        'column': 'flex-col',
        'row-reverse': 'flex-row-reverse',
        'column-reverse': 'flex-col-reverse',
    };

    const alignClasses = {
        'flex-start': 'items-start',
        'flex-end': 'items-end',
        'center': 'items-center',
        'baseline': 'items-baseline',
        'stretch': 'items-stretch',
    };

    const justifyClasses = {
        'flex-start': 'justify-start',
        'flex-end': 'justify-end',
        'center': 'justify-center',
        'space-between': 'justify-between',
        'space-around': 'justify-around',
        'space-evenly': 'justify-evenly',
    };

    const finalDirection = direction || flexDirection;
    const directionClass = finalDirection ? directionClasses[finalDirection] : '';
    const alignClass = alignItems ? alignClasses[alignItems] : '';
    const justifyClass = justifyContent ? justifyClasses[justifyContent] : '';
    const positionClass = position || '';

    const computedStyle: React.CSSProperties = {
        ...style,
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        gap: gap ? `${gap * 4}px` : undefined, // Chakra uses 4px per unit
        paddingLeft: px ? `${px * 4}px` : undefined,
        paddingRight: px ? `${px * 4}px` : undefined,
        paddingTop: py ? `${py * 4}px` : undefined,
        paddingBottom: py ? `${py * 4}px` : undefined,
        marginTop: mt ? `${mt * 4}px` : undefined,
        borderRadius: borderRadius ? `${borderRadius}px` : undefined,
        position,
        color,
        fontWeight,
        cursor,
        zIndex,
        backgroundColor,
    };

    return (
        <div
            ref={ref}
            className={`${baseClasses} ${directionClass} ${alignClass} ${justifyClass} ${positionClass} ${className}`}
            style={computedStyle}
            {...props}
        >
            {children}
        </div>
    );
});

Flex.displayName = 'Flex';
