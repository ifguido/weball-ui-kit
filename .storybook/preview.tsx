import type { Preview } from '@storybook/react';
import { WeballUIProvider } from '../src/WeballUIProvider';
import React from 'react';

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
    decorators: [
        (Story) => (
            <WeballUIProvider>
                <Story />
            </WeballUIProvider>
        ),
    ],
};

export default preview;
