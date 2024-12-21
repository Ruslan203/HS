import React from "react";
import Image from "next/image";
import basketIcon from "./assets/basket-icon.svg";

export const BasketIcon: React.FC = React.memo(() => (
    <Image src={basketIcon} alt="Иконка корзины" priority />
));

BasketIcon.displayName = "BasketIcon";
