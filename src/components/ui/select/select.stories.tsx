import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Select } from "./select";
import { SelectMenu } from "./select-menu";

const options = [
    { value: "all", label: "전체" },
    { value: "open", label: "진행 중" },
    { value: "closed", label: "마감" },
    { value: "disabled", label: "비활성 옵션", disabled: true },
];

const searchOptions = [
    { value: "new", label: "신축", icon: "limit" },
    { value: "construction", label: "공사", icon: "limit" },
] as const;

const meta = {
    title: "UI/Select",
    component: Select,
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "inline-radio",
            options: ["s", "xs"],
        },
        variant: {
            control: "inline-radio",
            options: ["white", "gray", "secondary"],
        },
        align: {
            control: "inline-radio",
            options: ["left", "right"],
        },
        menuVariant: {
            control: "inline-radio",
            options: ["default", "search"],
        },
    },
    args: {
        align: "left",
        ariaLabel: "상태 필터",
        options,
        placeholder: "상태",
        size: "s",
        variant: "white",
        menuVariant: "default",
    },
    decorators: [
        (Story) => (
            <div className="min-h-[220px] bg-white p-6">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
    args: {
        defaultValue: "open",
    },
};

export const Secondary: Story = {
    args: {
        defaultValue: "closed",
        variant: "secondary",
    },
};

export const Small: Story = {
    args: {
        defaultValue: "all",
        size: "xs",
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        defaultValue: "open",
    },
};

export const SearchMenu: Story = {
    render: () => (
        <div className="bg-white p-4">
            <SelectMenu options={[...searchOptions]} variant="search" />
        </div>
    ),
};
