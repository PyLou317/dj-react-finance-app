import { isValidElement } from "react";
import { Button as AriaButton, Link as AriaLink } from "react-aria-components";
import { Tooltip } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";
import { isReactComponent } from "@/utils/is-react-component";

export const styles = {
    secondary:
        "bg-primary text-fg-quaternary shadow-xs-skeuomorphic ring-1 ring-primary ring-inset hover:bg-primary_hover hover:text-fg-quaternary_hover disabled:shadow-xs",
    tertiary: "text-fg-quaternary hover:bg-primary_hover hover:text-fg-quaternary_hover",
};

/**
 * ButtonUtility component for icon-only buttons or links with tooltips.
 */
export const ButtonUtility = ({
    tooltip,
    className,
    isDisabled,
    icon: Icon,
    size = "sm",
    color = "secondary",
    tooltipPlacement = "top",
    ...otherProps
}) => {
    // Determine if we should render an anchor (Link) or a button
    const href = otherProps.href;
    const Component = href ? AriaLink : AriaButton;

    let props = {};

    if (href) {
        props = {
            ...otherProps,
            href: isDisabled ? undefined : href,
            // Manual data attributes for anchor tags which don't support "disabled" natively
            ...(isDisabled ? { "data-rac": true, "data-disabled": true } : {}),
        };
    } else {
        props = {
            ...otherProps,
            type: otherProps.type || "button",
            isDisabled,
        };
    }

    const content = (
        <Component
            aria-label={tooltip}
            {...props}
            className={cx(
                "group relative inline-flex h-max cursor-pointer items-center justify-center rounded-md p-1.5 outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                styles[color],

                // Icon selection and sizing via data attributes
                "*:data-icon:pointer-events-none *:data-icon:shrink-0 *:data-icon:text-current *:data-icon:transition-inherit-all",
                size === "xs" ? "*:data-icon:size-4" : "*:data-icon:size-5",

                className,
            )}
        >
            {/* Render Icon if it's a component or a valid React element */}
            {isReactComponent(Icon) && <Icon data-icon />}
            {isValidElement(Icon) && Icon}
        </Component>
    );

    // Wrap with Tooltip if a title is provided
    if (tooltip) {
        return (
            <Tooltip 
                title={tooltip} 
                placement={tooltipPlacement} 
                isDisabled={isDisabled} 
                offset={size === "xs" ? 4 : 6}
            >
                {content}
            </Tooltip>
        );
    }

    return content;
};