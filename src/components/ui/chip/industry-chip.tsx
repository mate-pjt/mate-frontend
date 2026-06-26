import { Chip, type ChipProps } from "./chip";

export type IndustryChipProps = Omit<ChipProps, "children" | "removable" | "textWeight"> & {
    children?: React.ReactNode;
};

export function IndustryChip({ children = "일반경쟁", onRemove, ...props }: IndustryChipProps) {
    return (
        <Chip onRemove={onRemove} removable={Boolean(onRemove)} textWeight="medium" {...props}>
            {children}
        </Chip>
    );
}
