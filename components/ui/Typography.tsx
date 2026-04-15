import { ReactNode } from "react";

// 1. Exactly matching your Figma Names
type TypographyVariant = 
  | "h1" 
  | "h2" 
  | "h3" 
  | "h4" 
  | "h5" 
  | "h6" 
  | "body-xl" 
  | "body-large" 
  | "body-medium"
  | "body-default" 
  | "body-small";

type TypographyColor =
  | "shade-900"
  | "shade-800"
  | "shade-700"
  | "shade-600"
  | "shade-500"
  | "shade-400"
  | "shade-300"
  | "shade-200"
  | "shade-100"
  | "royal-blue"
  | "sunshine-yellow"
  | "sweet-red"
  | "sky-blue"
  | "white";

interface TypographyProps {
  children: ReactNode;
  variant?: TypographyVariant;
  color?: TypographyColor;
  className?: string;
  as?: React.ElementType;
}

export default function Typography({
  children,
  variant = "body-default",
  color = "shade-900",
  className = "",
  as: Component = "p",
}: TypographyProps) {
  
  const variantStyles: Record<TypographyVariant, string> = {
    "h1": "text-[32px] md:text-[44px] lg:text-[56px] font-bold leading-[1.1] lg:leading-none",
    "h2": "text-[26px] md:text-[30px] lg:text-[36px] font-bold leading-[1.15] lg:leading-none",
    "h3": "text-[20px] md:text-[22px] lg:text-[24px] font-medium leading-[1.3] lg:leading-[32px]",
    "h4": "text-[16px] lg:text-[18px] font-medium leading-[1.2] lg:leading-none",
    "h5": "text-[14px] lg:text-[16px] font-medium leading-normal lg:leading-none",
    "h6": "text-[12px] font-bold leading-normal lg:leading-none",
    "body-xl": "text-[16px] md:text-[18px] lg:text-[20px] font-normal leading-[1.4] lg:leading-none",
    "body-large": "text-[16px] lg:text-[18px] font-normal leading-[1.5] lg:leading-[28px]",
    "body-medium": "text-[13px] lg:text-[15px] font-normal leading-[1.5] lg:leading-[22px]",
    "body-default": "text-[14px] lg:text-[16px] font-normal leading-[1.5] lg:leading-[24px]",
    "body-small": "text-[12px] font-normal leading-[1.5] lg:leading-none",
  };

  const colorStyles: Record<TypographyColor, string> = {
    "shade-900": "text-shade-900",
    "shade-800": "text-shade-800",
    "shade-700": "text-shade-700",
    "shade-600": "text-shade-600",
    "shade-500": "text-shade-500",
    "shade-400": "text-shade-400",
    "shade-300": "text-shade-300",
    "shade-200": "text-shade-200",
    "shade-100": "text-shade-100",
    "royal-blue": "text-royal-blue",
    "sunshine-yellow": "text-sunshine-yellow",
    "sweet-red": "text-sweet-red",
    "sky-blue": "text-sky-blue",
    "white": "text-white",
  };

  return (
    <Component className={` ${className} ${variantStyles[variant]} ${colorStyles[color]}`}>
      {children}
    </Component>
  );
}