import { LeftArrowIcon, RightArrowIcon } from "@/components/icons";

const iconProps = {
    width: 16,
    height: 16,
    "aria-hidden": true,
    focusable: "false",
} as const;

const buttonIcons = {
    "arrow-left": <LeftArrowIcon {...iconProps} />,
    "arrow-right": <RightArrowIcon {...iconProps} />,
} as const;

export type ButtonIconName = keyof typeof buttonIcons;

type ButtonIconProps = {
    icon: ButtonIconName;
};

export function ButtonIcon({ icon }: ButtonIconProps) {
    return buttonIcons[icon];
}
