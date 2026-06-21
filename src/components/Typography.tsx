import React from "react";

type TypographyVariant =
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "caption"
    | "overline";

type TypographyColor =
    | "default"
    | "muted"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "inherit";

type TypographyWeight =
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold";

type TypographyAlign = "left" | "center" | "right" | "justify";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    variant?: TypographyVariant;
    as?: React.ElementType;
    color?: TypographyColor;
    weight?: TypographyWeight;
    align?: TypographyAlign;
    gutterBottom?: boolean;
    children: React.ReactNode;
}

const variantStyles: Record<TypographyVariant, string> = {
    h1: "text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl",
    h2: "text-3xl font-bold tracking-tight md:text-4xl",
    h3: "text-2xl font-bold tracking-tight md:text-3xl",
    h4: "text-xl font-semibold tracking-tight md:text-2xl",
    h5: "text-lg font-semibold tracking-tight md:text-xl",
    h6: "text-base font-semibold tracking-tight md:text-lg",
    subtitle1: "text-lg font-medium",
    subtitle2: "text-sm font-medium",
    body1: "text-base leading-relaxed",
    body2: "text-sm leading-relaxed",
    caption: "text-xs tracking-wide",
    overline: "text-[10px] uppercase tracking-widest font-semibold",
};

const defaultTags: Record<TypographyVariant, React.ElementType> = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    subtitle1: "p",
    subtitle2: "p",
    body1: "p",
    body2: "p",
    caption: "span",
    overline: "span",
};

const colorStyles: Record<TypographyColor, string> = {
    default: "text-neutral-900 dark:text-neutral-50",
    muted: "text-neutral-500 dark:text-neutral-400",
    primary: "text-primary-600 dark:text-primary-400",
    secondary: "text-neutral-600 dark:text-neutral-300",
    success: "text-primary-500 dark:text-primary-400",
    warning: "text-amber-500 dark:text-amber-400",
    error: "text-red-500 dark:text-red-400",
    inherit: "text-inherit",
};

const weightStyles: Record<TypographyWeight, string> = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
};

const alignStyles: Record<TypographyAlign, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
};

const gutterBottomStyles: Record<TypographyVariant, string> = {
    h1: "mb-6",
    h2: "mb-5",
    h3: "mb-4",
    h4: "mb-3",
    h5: "mb-3",
    h6: "mb-2",
    subtitle1: "mb-2.5",
    subtitle2: "mb-2",
    body1: "mb-3",
    body2: "mb-2.5",
    caption: "mb-1",
    overline: "mb-1",
};

export default function Typography({
    variant = "body1",
    as,
    color = "default",
    weight,
    align = "left",
    gutterBottom = false,
    className = "",
    children,
    ...props
}: TypographyProps) {
    const Component = as || defaultTags[variant];

    const classes = [
        variantStyles[variant],
        color !== "inherit" ? colorStyles[color] : "",
        weight ? weightStyles[weight] : "",
        alignStyles[align],
        gutterBottom ? gutterBottomStyles[variant] : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <Component className={classes} {...props}>
            {children}
        </Component>
    );
}
