import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "./button";
import { ButtonLink } from "./button-link";

const variants = [
    "primary",
    "secondary",
    "tertiary",
    "gray",
    "outline",
    "text_lightblue",
    "text_darkblue",
    "text_gray",
    "text_white",
] as const;

const sizes = ["xs", "sm", "lg", "xxl"] as const;
const icons = ["arrow-left", "arrow-right"] as const;

const meta = {
    title: "UI/Button",
    component: Button,
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: variants,
        },
        size: {
            control: "select",
            options: sizes,
        },
        icon: {
            control: "select",
            options: icons,
        },
        iconPosition: {
            control: "inline-radio",
            options: ["left", "right"],
        },
    },
    args: {
        children: "버튼",
        size: "sm",
        variant: "primary",
    },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = {
    args: {
        icon: "arrow-right",
        iconPosition: "right",
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

export const Variants: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-3 bg-white p-4">
            {variants.map((variant) => (
                <div
                    className={variant === "text_white" ? "rounded-[8px] bg-grayscale-700 p-2" : undefined}
                    key={variant}
                >
                    <Button variant={variant}>{variant}</Button>
                </div>
            ))}
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-3 bg-white p-4">
            {sizes.map((size) => (
                <Button key={size} size={size}>
                    {size}
                </Button>
            ))}
        </div>
    ),
};

export const Link: Story = {
    render: (args) => (
        <ButtonLink
            href="/"
            icon={args.icon}
            iconPosition={args.iconPosition}
            size={args.size}
            variant={args.variant}
        >
            링크 버튼
        </ButtonLink>
    ),
    args: {
        icon: "arrow-right",
        iconPosition: "right",
    },
};
