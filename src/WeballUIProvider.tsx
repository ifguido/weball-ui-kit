import React, { createContext, useContext } from 'react';

// Tipo del tema
interface WeballThemeType {
    colors: {
        weball: {
            primary: string;
            secondary: string;
            darkGrey: string;
            grey: string;
            success: string;
            warning: string;
            error: string;
        };
    };
}

// Tema personalizado para Weball
const weballTheme: WeballThemeType = {
    colors: {
        weball: {
            primary: '#2EC7A6',
            secondary: '#05BACF',
            darkGrey: '#464646',
            grey: '#707070',
            success: '#66bb6a',
            warning: '#ffa726',
            error: '#ef5350',
        },
    },
};

const WeballThemeContext = createContext<WeballThemeType>(weballTheme);

export const useWeballTheme = () => useContext(WeballThemeContext);

export interface WeballUIProviderProps {
    children: React.ReactNode;
    theme?: WeballThemeType;
}

/**
 * Provider component that wraps your app with necessary providers for Weball UI Kit
 */
export const WeballUIProvider: React.FC<WeballUIProviderProps> = ({
    children,
    theme = weballTheme,
}) => {
    return (
        <WeballThemeContext.Provider value={theme}>
            {children}
        </WeballThemeContext.Provider>
    );
};

export default WeballUIProvider;
