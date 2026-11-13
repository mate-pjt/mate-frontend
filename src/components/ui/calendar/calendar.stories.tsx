import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Calendar, DatePicker } from ".";

const meta = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  args: { value: "2026-01-01", minDate: "1900-01-01", maxDate: "2026-11-13", today: "2026-11-13", onValueChange: () => {} },
  render: (args) => <CalendarExample {...args} />,
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

function CalendarExample(args: React.ComponentProps<typeof Calendar>) {
  const [value, setValue] = useState(args.value);
  return <Calendar {...args} onValueChange={setValue} value={value} />;
}

export const Selected: Story = {};
export const Empty: Story = { args: { value: "" } };
export const LeapYear: Story = { args: { value: "2024-02-29" } };
export const MaximumDate: Story = { args: { value: "2026-11-13" } };
export const MinimumDate: Story = { args: { value: "1900-01-01" } };
export const Narrow: Story = { decorators: [(Story) => <div className="w-72"><Story /></div>] };
export const Input: Story = { render: () => <DatePickerExample /> };

function DatePickerExample() {
  const [value, setValue] = useState("");
  return <div className="w-full max-w-[594px]"><label className="text-grayscale-700 type-body-3" htmlFor="storybook-birthdate">생년월일(선택)</label><DatePicker id="storybook-birthdate" label="생년월일" maxDate="2026-11-13" minDate="1900-01-01" onValueChange={setValue} placeholder="생년월일을 선택해주세요." value={value} /></div>;
}
