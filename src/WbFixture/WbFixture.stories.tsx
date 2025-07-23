import type { Meta, StoryObj } from '@storybook/react';
import { WbFixture } from './components/WbFixture';

const meta: Meta<typeof WbFixture> = {
    title: 'Components/WbFixture',
    component: WbFixture,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'A fixture visualization component for displaying tournament brackets.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        onClickNode: { action: 'clicked' },
        onResultSaved: { action: 'result saved' },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        cupLogo: 'https://via.placeholder.com/50x50?text=Cup',
    },
};

export const EmptyFixture: Story = {
    args: {
        cupLogo: 'https://via.placeholder.com/50x50?text=Cup',
    },
};
