import React from 'react';

export interface ImageProps {
    src: string;
    alt?: string;
    width?: string;
    height?: string;
    className?: string;
    style?: React.CSSProperties;
    onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
    onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const Image: React.FC<ImageProps> = ({
    src,
    alt = '',
    width,
    height,
    className = '',
    style,
    onError,
    onLoad,
    ...props
}) => {
    const computedStyle: React.CSSProperties = {
        ...style,
        width,
        height,
    };

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            style={computedStyle}
            onError={onError}
            onLoad={onLoad}
            {...props}
        />
    );
};
