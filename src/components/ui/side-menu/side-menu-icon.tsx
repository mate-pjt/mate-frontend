import {
    AddIcon,
    CalendarIcon,
    CheckIcon,
    ClipIcon,
    CloseIcon,
    CompanyIcon,
    DownArrowIcon,
    HeartIcon,
    InfoIcon,
    LimitIcon,
    MinusIcon,
    OutIcon,
    PersonIcon,
    ResetIcon,
    SearchIcon,
    SettingIcon,
    ShareIcon,
    ShortcutIcon,
    UpArrowIcon,
} from "@/components/icons";

const iconProps = {
    width: 20,
    height: 20,
    "aria-hidden": true,
    focusable: "false",
} as const;

const sideMenuIcons = {
    add: <AddIcon {...iconProps} />,
    calendar: <CalendarIcon {...iconProps} />,
    check: <CheckIcon {...iconProps} />,
    clip: <ClipIcon {...iconProps} />,
    close: <CloseIcon {...iconProps} />,
    company: <CompanyIcon {...iconProps} />,
    "chevron-down": <DownArrowIcon {...iconProps} />,
    "chevron-up": <UpArrowIcon {...iconProps} />,
    heart: <HeartIcon {...iconProps} />,
    info: <InfoIcon {...iconProps} />,
    limit: <LimitIcon {...iconProps} />,
    minus: <MinusIcon {...iconProps} />,
    out: <OutIcon {...iconProps} />,
    person: <PersonIcon {...iconProps} />,
    reset: <ResetIcon {...iconProps} />,
    search: <SearchIcon {...iconProps} />,
    setting: <SettingIcon {...iconProps} />,
    share: <ShareIcon {...iconProps} />,
    shortcut: <ShortcutIcon {...iconProps} />,
} as const;

export type SideMenuIconName = keyof typeof sideMenuIcons;

type SideMenuIconProps = {
    icon: SideMenuIconName;
};

export function SideMenuIcon({ icon }: SideMenuIconProps) {
    return sideMenuIcons[icon];
}
