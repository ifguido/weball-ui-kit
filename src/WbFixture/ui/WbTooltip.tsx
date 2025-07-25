import React from 'react';
import { Tooltip as AntTooltip } from 'antd';

/**
 * Custom Tooltip component that works better with scaled containers
 * Fixes positioning issues when parent elements have transform: scale()
 */
interface WbTooltipProps {
    children: React.ReactNode;
    title: React.ReactNode;
    /**
     * Whether the tooltip is inside a scaled container
     * When true, uses document.body as popup container to avoid positioning issues
     */
    insideScaledContainer?: boolean;
    getPopupContainer?: (triggerNode: Element) => HTMLElement;
    mouseEnterDelay?: number;
    mouseLeaveDelay?: number;
    placement?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
    overlayStyle?: React.CSSProperties;
}

export const WbTooltip: React.FC<WbTooltipProps> = ({
    children,
    title,
    insideScaledContainer = false,
    getPopupContainer,
    mouseEnterDelay = 0.3,
    mouseLeaveDelay = 0.1,
    placement = "top",
    overlayStyle,
    ...props
}) => {
    // Auto-detect if we should use document.body as container
    const popupContainer = React.useMemo(() => {
        if (getPopupContainer) {
            return getPopupContainer;
        }

        if (insideScaledContainer) {
            return () => document.body;
        }

        // Default behavior - try to use parent element, fallback to body
        return (triggerNode: Element) => {
            const parent = triggerNode.parentElement;
            if (!parent) return document.body;

            // Check if any parent has transform scale
            let element: HTMLElement | null = parent;
            while (element && element !== document.body) {
                const style = window.getComputedStyle(element);
                const transform = style.transform;

                if (transform && transform !== 'none' && transform.includes('scale')) {
                    // Parent has scale transform, use document.body
                    return document.body;
                }

                element = element.parentElement;
            }

            return parent;
        };
    }, [getPopupContainer, insideScaledContainer]);

    return (
        <AntTooltip
            title={title}
            getPopupContainer={popupContainer}
            mouseEnterDelay={mouseEnterDelay}
            mouseLeaveDelay={mouseLeaveDelay}
            placement={placement}
            // Add overlay style to ensure proper visibility
            overlayStyle={{
                zIndex: 9999,
                ...overlayStyle,
            }}
        >
            {children}
        </AntTooltip>
    );
};

export default WbTooltip;
