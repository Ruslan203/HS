import React from "react";
import Image from "next/image";
import arrowDownIcon from "./assets/arrow-down.svg";

export interface ArrowDownIconProps {
    width?: number;
    height?: number;
}

export const ArrowDownIcon: React.FC<ArrowDownIconProps> = ({width = 20, height = 10}) => (
    <Image src={arrowDownIcon} width={width} height={height} alt="Стрелка вниз" priority />
);
