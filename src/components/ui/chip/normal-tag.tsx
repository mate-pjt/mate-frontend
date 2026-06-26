import { Chip, type ChipProps } from "./chip";

export type NormalTagProps = Omit<ChipProps, "children" | "removable" | "textWeight"> & {
    children?: React.ReactNode;
};

export function NormalTag({ children = "일반경쟁", ...props }: NormalTagProps) {
    return (
        <Chip textWeight="semibold" {...props}>
            {children}
        </Chip>
    );
}
