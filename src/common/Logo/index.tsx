import React from "react";
import Image from "next/image";
import logo from "./assets/logo.svg";

export const Logo: React.FC = React.memo(() => (
    <Image src={logo} width={130} alt="Логотип Suite Textile" loading="eager" />
));

Logo.displayName = "Logo";
