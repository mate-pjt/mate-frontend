import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BidCard } from "./bid-card";

const sampleBid = {
    category: "공사",
    closesAt: "2026.05.26",
    contractMethod: "제한경쟁",
    estimatedPrice: "28,250,000",
    noticeNumber: "R26BK01532990",
    organization: "경상남도 함양군",
    publishedAt: "2026.05.26",
    title: "함양 구남정사 보수공사",
};

const meta = {
    title: "UI/Card/BidCard",
    component: BidCard,
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "inline-radio",
            options: ["fill", "stroke"],
        },
        selected: {
            control: "boolean",
        },
    },
    args: {
        ...sampleBid,
        selected: false,
        variant: "fill",
    },
    decorators: [
        (Story) => (
            <div className="bg-[#212121] p-4">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof BidCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Fill: Story = {};

export const Stroke: Story = {
    args: {
        variant: "stroke",
    },
};

export const Selected: Story = {
    args: {
        selected: true,
    },
};

export const All: Story = {
    render: () => (
        <div className="flex w-[420px] flex-col gap-4 bg-[#212121] p-4">
            <BidCard {...sampleBid} />
            <BidCard {...sampleBid} variant="stroke" />
            <BidCard {...sampleBid} selected />
        </div>
    ),
};
