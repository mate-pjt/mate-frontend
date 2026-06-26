import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CheckboxCircle } from "./checkbox-circle";
import { CheckboxSquare } from "./checkbox-square";

const meta = {
    title: "UI/Checkbox",
    component: CheckboxSquare,
    tags: ["autodocs"],
    args: {
        ariaLabel: "체크박스",
    },
    decorators: [
        (Story) => (
            <div className="bg-white p-6">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof CheckboxSquare>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Square: Story = {};

export const SquareChecked: Story = {
    args: {
        defaultChecked: true,
    },
};

export const SquareDisabled: Story = {
    args: {
        disabled: true,
    },
};

export const Circle: Story = {
    render: () => <CheckboxCircle ariaLabel="원형 체크박스" />,
};

export const CircleDefault: Story = {
    render: () => <CheckboxCircle ariaLabel="원형 체크박스" defaultActive={false} />,
};

export const States: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <CheckboxSquare ariaLabel="기본 체크박스" />
            <CheckboxSquare ariaLabel="비활성 체크박스" disabled />
            <CheckboxSquare ariaLabel="선택된 체크박스" defaultChecked />
            <CheckboxCircle ariaLabel="활성 원형 체크박스" />
            <CheckboxCircle ariaLabel="기본 원형 체크박스" defaultActive={false} />
        </div>
    ),
};
