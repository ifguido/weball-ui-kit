import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// Tema personalizado para Weball
const weballTheme = extendTheme({
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
});

export interface WeballUIProviderProps {
  children: React.ReactNode;
  theme?: Record<string, any>;
}

/**
 * Provider component that wraps your app with necessary providers for Weball UI Kit
 */
export const WeballUIProvider: React.FC<WeballUIProviderProps> = ({
  children,
  theme = weballTheme,
}) => {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  );
};

export default WeballUIProvider;
