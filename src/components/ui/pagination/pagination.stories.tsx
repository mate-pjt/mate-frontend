import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Pagination } from "./pagination";

const meta = {
    title: "UI/Pagination",
    component: Pagination,
    tags: ["autodocs"],
    args: {
        totalPages: 999,
    },
    decorators: [
        (Story) => (
            <div className="bg-white p-6">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Next: Story = {
    args: {
        defaultPage: 2,
    },
};

export const Middle: Story = {
    args: {
        defaultPage: 500,
    },
};

export const Last: Story = {
    args: {
        defaultPage: 999,
    },
};

export const FewPages: Story = {
    args: {
        defaultPage: 3,
        totalPages: 5,
    },
};
