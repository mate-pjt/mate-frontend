import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SideMenu } from "./side-menu";
import type { SideMenuItem } from "./side-menu";

const items: SideMenuItem[] = [
    { value: "company", label: "회사 정보", icon: "company" },
    { value: "person", label: "담당자 관리", icon: "person" },
    { value: "alarm", label: "알림 설정", icon: "setting" },
    { value: "shortcut", label: "바로가기", icon: "shortcut" },
];

const meta = {
    title: "UI/SideMenu",
    component: SideMenu,
    tags: ["autodocs"],
    args: {
        ariaLabel: "마이페이지 메뉴",
        items,
    },
    decorators: [
        (Story) => (
            <div className="w-[280px] bg-white p-4">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof SideMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
    args: {
        defaultValue: "person",
    },
};

export const WithDisabledItem: Story = {
    args: {
        defaultValue: "company",
        items: [
            { value: "company", label: "회사 정보", icon: "company" },
            { value: "person", label: "담당자 관리", icon: "person" },
            { value: "billing", label: "결제 관리", icon: "limit", disabled: true },
            { value: "logout", label: "로그아웃", icon: "out" },
        ],
    },
};
