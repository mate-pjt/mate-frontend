import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
    AgencyCategoryPopover,
    CalendarCategoryPopover,
    ContractCategoryPopover,
    IndustryCategoryPopover,
    PlaceCategoryPopover,
    PriceCategoryPopover,
    PublicCategoryPopover,
} from "./filter-popover";

const meta = {
    title: "UI/FilterPopover",
    component: PublicCategoryPopover,
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div className="min-h-[520px] bg-[#2b2b2b] p-5">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof PublicCategoryPopover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PublicCategory: Story = {
    render: () => (
        <div className="flex flex-wrap gap-5">
            <PublicCategoryPopover />
            <PublicCategoryPopover highlightedValue="service" />
            <PublicCategoryPopover resetDisabled={false} saveDisabled={false} selectedValue="service" />
        </div>
    ),
};

export const IndustryCategory: Story = {
    render: () => (
        <div className="flex flex-wrap gap-5">
            <IndustryCategoryPopover />
            <IndustryCategoryPopover showCaret />
            <IndustryCategoryPopover inputValue="금속창호" />
            <IndustryCategoryPopover tags={["금속창호 · 지붕건축물조립"]} />
            <IndustryCategoryPopover
                tags={[
                    "방사성동위원소 사용 업무대행자 · 방사성동위원소 등 및 방사성폐기물의 수거·처리 및 운반",
                ]}
            />
        </div>
    ),
};

export const PlaceCategory: Story = {
    render: () => (
        <div className="flex flex-wrap gap-5">
            <PlaceCategoryPopover />
            <PlaceCategoryPopover city="서울특별시" cityOptions={["서울특별시", "경기도"]} />
            <PlaceCategoryPopover
                city="서울특별시"
                district="전체"
                tag="서울특별시 전체"
            />
            <PlaceCategoryPopover
                city="서울특별시"
                district="전체"
                localOnly
                selectedCooperative="all"
                tag="서울특별시 전체 · 전체 · 관내"
            />
        </div>
    ),
};

export const CalendarCategory: Story = {
    render: () => (
        <div className="flex flex-wrap gap-5">
            <CalendarCategoryPopover />
            <CalendarCategoryPopover endDate="2026.05.31" selectedQuickRange="1개월" />
        </div>
    ),
};

export const PriceCategory: Story = {
    render: () => (
        <div className="flex flex-wrap gap-5">
            <PriceCategoryPopover />
            <PriceCategoryPopover
                maxLabel="1억 원 이하"
                selectedPreset="1억 원 이하"
            />
            <PriceCategoryPopover
                maxLabel="100억 원 이하"
                minLabel="50억 원"
                selectedPreset="50억 ~ 100억 원 이하"
            />
        </div>
    ),
};

export const ContractAndAgencyCategory: Story = {
    render: () => (
        <div className="flex flex-wrap gap-5">
            <ContractCategoryPopover />
            <ContractCategoryPopover methods={["일반경쟁", "제한경쟁", "수의계약"]} selectedMethod="일반경쟁" />
            <AgencyCategoryPopover />
            <AgencyCategoryPopover agencies={["전체", "대전보건대학교", "서울디지털재단"]} selectedAgency="전체" />
        </div>
    ),
};
