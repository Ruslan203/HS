/// <reference path="./styled.d.ts" />
import React, {useContext} from "react";
import {ThemeContext, ThemeProvider} from "styled-components";
import {faBrandsFont, robotoFont} from "@common/fonts";
import {ThemeOptions} from "./types";

export enum ThemeZIndex {
    mobileCategories = 1,
    header,
    navMenuBackdrop,
    navMenu,
    navMenuToggle,
    mobileMenuBackdrop,
    mobileMenu,
    mobileMenuToggle,
    backdrop,
    modal,
    appProgress
}

export namespace Theme {
    export const theme: ThemeOptions = {
        palette: {
            black: "#241E0C",
            white: "#FFFFFF",
            dividers: "#e9e9e7",
            primary: "#3f344f",
            primaryLight: "#746191",
            red: "#DE2104",
            gray: "#d3d2ce",
            darkGray: "#666255"
        },
        zIndex: ThemeZIndex,
        container: {
            maxWidth: "1170px"
        },
        mobile: {
            screenMaxWidth: "1040px"
        },
        mobileMenu: {
            width: "400px",
            toggleSize: "23px"
        },
        header: {
            height: "80px",
            mobileHeight: "70px"
        },
        footer: {
            minHeight: "150px"
        },
        fonts: {
            faBrands: faBrandsFont.style.fontFamily,
            roboto: robotoFont.style.fontFamily
        },
        appProgress: {
            color: "white"
        }
    };

    export type ProviderProps = Partial<ThemeOptions> & React.PropsWithChildren;

    export const Provider: React.FC<ProviderProps> = ({children, ...themeOptions}) => (
        <ThemeProvider theme={{...theme, ...themeOptions}}>{children}</ThemeProvider>
    );
}

export function useTheme(): ThemeOptions {
    return useContext(ThemeContext);
}

export * from "./types";
