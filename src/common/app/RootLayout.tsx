import React from "react";
import {Footer} from "@common/Footer";
import {Header, HeaderOffset} from "@common/Header";

export const AppRootLayout: React.FC<React.PropsWithChildren> = ({children}) => (
    <>
        <Header />
        <HeaderOffset />
        {children}
        <Footer />
    </>
);
