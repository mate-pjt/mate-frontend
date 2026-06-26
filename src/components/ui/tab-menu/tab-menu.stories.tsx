import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TabMenu } from "./tab-menu";

const items = [
    { value: "all", label: "전체" },
    { value: "participating", label: "참여 중" },
    { value: "completed", label: "완료" },
];

const meta = {
    title: "UI/TabMenu",
    component: TabMenu,
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "inline-radio",
            options: ["s", "xs"],
        },
    },
    args: {
        ariaLabel: "입찰 상태",
        items,
        size: "s",
    },
    decorators: [
        (Story) => (
            <div className="bg-white p-6">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof TabMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
    args: {
        defaultValue: "participating",
    },
};

export const Small: Story = {
    args: {
        defaultValue: "completed",
        size: "xs",
    },
};

export const WithDisabledItem: Story = {
    args: {
        items: [
            { value: "all", label: "전체" },
            { value: "scheduled", label: "예정", disabled: true },
            { value: "closed", label: "마감" },
        ],
    },
};
