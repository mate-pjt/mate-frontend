import Link from "next/link";

import { ButtonIcon } from "./button-icon";
import { getButtonClassName, type ButtonStyleProps } from "./button-styles";

type ButtonLinkProps = React.ComponentProps<typeof Link> & ButtonStyleProps;

export function ButtonLink({
    children,
    className,
    variant = "primary",
    size = "sm",
    icon,
    iconPosition = "left",
    ...props
}: ButtonLinkProps) {
    return (
        <Link
            className={getButtonClassName({
                variant,
                size,
                hasIcon: Boolean(icon),
                className,
                interaction: "link",
            })}
            {...props}
        >
            {icon && iconPosition === "left" && <ButtonIcon icon={icon} />}
            {children}
            {icon && iconPosition === "right" && <ButtonIcon icon={icon} />}
        </Link>
    );
}
