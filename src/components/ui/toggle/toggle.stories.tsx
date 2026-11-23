import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Toggle } from "./toggle";

const meta = {
    title: "UI/Toggle",
    component: Toggle,
    tags: ["autodocs"],
    args: {
        ariaLabel: "알림 설정",
    },
    decorators: [
        (Story) => (
            <div className="bg-white p-6">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const On: Story = {};

export const Off: Story = {
    args: {
        defaultChecked: false,
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

export const Unavailable: Story = {
    args: {
        ariaLabel: "지원되지 않는 알림 설정",
        unavailable: true,
    },
};

export const States: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <Toggle ariaLabel="켜짐" />
            <Toggle ariaLabel="꺼짐" defaultChecked={false} />
            <Toggle ariaLabel="비활성" disabled />
            <Toggle ariaLabel="미지원" unavailable />
        </div>
    ),
};
