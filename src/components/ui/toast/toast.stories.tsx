import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/components/ui/button";

import { showToast, ToastViewport } from "./toast";

const meta = {
  title: "UI/Toast",
  component: ToastViewport,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="min-h-[240px] bg-white p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ToastViewport>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <>
      <Button onClick={() => showToast("선택한 소식을 삭제했어요!")}>Toast 열기</Button>
      <ToastViewport />
    </>
  ),
};

export const CustomDuration: Story = {
  render: () => (
    <>
      <Button onClick={() => showToast("5초 동안 소식을 보여드려요!", { duration: 5000 })}>
        5초 Toast 열기
      </Button>
      <ToastViewport />
    </>
  ),
};

export const ReplaceCurrent: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => showToast("첫 번째 소식이에요!")}>첫 번째 Toast</Button>
      <Button onClick={() => showToast("새로운 소식으로 교체했어요!")} variant="secondary">
        새 Toast로 교체
      </Button>
      <ToastViewport />
    </div>
  ),
};
