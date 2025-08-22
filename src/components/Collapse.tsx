import React, { useEffect, useRef, useState } from 'react';

export interface CollapseProps {
    children: React.ReactNode;
    in: boolean;
    animateOpacity?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export const Collapse: React.FC<CollapseProps> = ({
    children,
    in: isOpen,
    animateOpacity = false,
    className = '',
    style,
}) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | 'auto'>(isOpen ? 'auto' : 0);

    useEffect(() => {
  if (contentRef.current) {
    const contentHeight = contentRef.current.scrollHeight;
    if (isOpen) {
      setHeight(contentHeight);
      const id = setTimeout(() => setHeight('auto'), 300);
      return () => clearTimeout(id);
    } else {
      setHeight(0);
    }
  }
}, [isOpen, children]);

    const computedStyle: React.CSSProperties = {
        ...style,
        height: height === 'auto' ? 'auto' : `${height}px`,
        overflow: 'hidden',
        transition: `height 0.3s ease-in-out${animateOpacity ? ', opacity 0.3s ease-in-out' : ''}`,
        opacity: animateOpacity ? (isOpen ? 1 : 0) : 1,
    };

    return (
        <div
            ref={contentRef}
            className={className}
            style={computedStyle}
        >
            {children}
        </div>
    );
};
