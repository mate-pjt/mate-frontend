import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { SearchInput } from "./search-input";
import { TextInput } from "./text-input";

const meta = {
    title: "UI/Input",
    component: TextInput,
    tags: ["autodocs"],
    argTypes: {
        status: {
            control: "inline-radio",
            options: ["default", "check", "error", "success"],
        },
        helperAlign: {
            control: "inline-radio",
            options: ["left", "right"],
        },
    },
    args: {
        placeholder: "텍스트",
        status: "default",
    },
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Typing: Story = {
    args: {
        defaultValue: "텍스트",
    },
};

export const Error: Story = {
    args: {
        defaultValue: "텍스트",
        helperText: "*123",
        status: "error",
    },
};

export const Check: Story = {
    args: {
        defaultValue: "텍스트",
        status: "check",
    },
};

export const Success: Story = {
    args: {
        helperText: "*123",
        status: "success",
    },
};

export const WithSuffix: Story = {
    args: {
        defaultValue: "텍스트",
        helperAlign: "right",
        helperText: "*123",
        suffix: "원",
    },
};

export const Search: Story = {
    render: () => (
        <div className="flex flex-col gap-4 bg-[#2b2b2b] p-5">
            <div className="flex gap-6">
                <SearchInput variant="popup" />
                <SearchInput variant="default" />
            </div>
            <div className="flex gap-6">
                <SearchInput autoFocus variant="popup" />
                <SearchInput autoFocus variant="default" />
            </div>
            <div className="flex gap-6">
                <SearchInput defaultValue="텍스트" variant="popup" />
                <SearchInput defaultValue="텍스트" variant="default" />
            </div>
        </div>
    ),
};

export const AllTextInputStates: Story = {
    render: () => (
        <div className="flex flex-col gap-5 bg-[#2b2b2b] p-5">
            <TextInput />
            <TextInput autoFocus />
            <TextInput defaultValue="텍스트" />
            <TextInput defaultValue="텍스트" helperText="*123" status="error" />
            <TextInput defaultValue="텍스트" status="check" />
            <TextInput helperText="*123" status="success" />
            <TextInput helperAlign="right" helperText="*123" suffix="원" />
            <TextInput defaultValue="텍스트" helperAlign="right" helperText="*123" suffix="원" />
        </div>
    ),
};

export const Controlled: Story = {
    render: () => <ControlledInputExamples />,
};

function ControlledInputExamples() {
    const [textValue, setTextValue] = useState("텍스트");
    const [searchValue, setSearchValue] = useState("텍스트");

    return (
        <div className="flex flex-col gap-4 bg-white p-4">
            <TextInput
                onChange={(event) => setTextValue(event.target.value)}
                value={textValue}
            />
            <SearchInput
                onChange={(event) => setSearchValue(event.target.value)}
                value={searchValue}
                variant="default"
            />
        </div>
    );
}
