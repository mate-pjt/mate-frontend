import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Chip } from "./chip";
import { IndustryChip } from "./industry-chip";
import { NormalTag } from "./normal-tag";

const meta = {
    title: "UI/Chip",
    component: Chip,
    tags: ["autodocs"],
    argTypes: {
        textWeight: {
            control: "inline-radio",
            options: ["medium", "semibold"],
        },
    },
    args: {
        children: "일반경쟁",
        textWeight: "medium",
    },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NormalTagStory: Story = {
    name: "NormalTag",
    render: () => <NormalTag />,
};

export const IndustryChipStory: Story = {
    name: "IndustryChip",
    render: () => <IndustryChip onRemove={() => undefined} />,
};

export const All: Story = {
    render: () => (
        <div className="flex items-center gap-3 bg-white p-4">
            <NormalTag />
            <IndustryChip onRemove={() => undefined} />
        </div>
    ),
};
