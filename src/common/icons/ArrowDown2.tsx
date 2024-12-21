import React from "react";
import Image from "next/image";
import arrowDown2Icon from "./assets/arrow-down-2.svg";

export interface ArrowDown2IconProps {
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
}

export const ArrowDown2Icon: React.FC<ArrowDown2IconProps> = React.forwardRef<
    HTMLImageElement,
    ArrowDown2IconProps
>(({className, style, width = 10, height = 6}, ref) => (
    <Image
        ref={ref}
        className={className}
        style={style}
        src={arrowDown2Icon}
        width={width}
        height={height}
        alt="Стрелка вниз"
        priority
    />
));

ArrowDown2Icon.displayName = "ArrowDown2Icon";
