import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
    AlarmPopup,
    BasicPopup,
    CorrectionPopup,
    PasswordPopup,
    UploadPopup,
    WithdrawalConfirmPopup,
    WithdrawalEmailPopup,
} from "./popup";

const meta = {
    title: "UI/Popup",
    component: BasicPopup,
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div className="min-h-[720px] bg-[#2b2b2b] p-5">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof BasicPopup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    render: () => (
        <div className="flex flex-col gap-5">
            <BasicPopup />
            <BasicPopup secondaryAction={{ label: "다음에 하기" }} />
        </div>
    ),
};

export const Alarm: Story = {
    render: () => (
        <div className="flex flex-col gap-5">
            <AlarmPopup />
            <AlarmPopup enabled />
            <AlarmPopup enabled primaryDisabled />
            <AlarmPopup primaryDisabled={false} />
        </div>
    ),
};

export const Correction: Story = {
    render: () => (
        <div className="flex flex-col gap-5">
            <CorrectionPopup selectedId="third" />
            <CorrectionPopup selectedId="second" />
        </div>
    ),
};

export const Upload: Story = {
    render: () => (
        <div className="flex flex-col gap-10">
            <UploadPopup />
            <UploadPopup file={{ name: "사업자등록증_파인엠이에스_2024.pdf", size: "2.4MB" }} />
        </div>
    ),
};

export const Password: Story = {
    render: () => (
        <div className="flex flex-col gap-5">
            <PasswordPopup />
            <PasswordPopup state="filled" />
            <PasswordPopup state="visible" />
            <PasswordPopup state="error" />
        </div>
    ),
};

export const WithdrawalConfirm: Story = {
    render: () => (
        <div className="flex flex-col gap-5">
            <WithdrawalConfirmPopup />
            <WithdrawalConfirmPopup checked />
        </div>
    ),
};

export const WithdrawalEmail: Story = {
    render: () => (
        <div className="flex flex-col gap-5">
            <WithdrawalEmailPopup />
            <WithdrawalEmailPopup email="example@example.com" step="emailSent" />
            <WithdrawalEmailPopup email="example@example.com" step="emailError" />
            <WithdrawalEmailPopup step="codeReady" />
            <WithdrawalEmailPopup code="0000" step="codeInput" />
            <WithdrawalEmailPopup code="0000" step="codeError" />
            <WithdrawalEmailPopup code="4878" step="codeVerified" />
        </div>
    ),
};
