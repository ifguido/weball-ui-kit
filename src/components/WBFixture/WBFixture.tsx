import React from 'react';
import './WBFixture.css';

export interface WBFixtureProps {
    /**
     * The title of the fixture
     */
    title?: string;
    /**
     * Custom class name for styling
     */
    className?: string;
    /**
     * Children elements to render inside the fixture
     */
    children?: React.ReactNode;
}

/**
 * WBFixture component for displaying fixture information
 */
export const WBFixture: React.FC<WBFixtureProps> = ({
    title,
    className = '',
    children,
    ...props
}) => {
    return (
        <div className={`wb-fixture ${className}`} {...props}>
            {title && <h3 className="wb-fixture__title">{title}</h3>}
            <div className="wb-fixture__content">
                {children}
            </div>
        </div>
    );
};

export default WBFixture;
