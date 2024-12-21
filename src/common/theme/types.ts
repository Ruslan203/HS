export interface Palette {
    black: string;
    white: string;
    dividers: string;
    primary: string;
    primaryLight: string;
    red: string;
    gray: string;
    darkGray: string;
}

export interface ZIndex {
    header: number;
    mobileCategories: number;
    backdrop: number;
    modal: number;
    navMenu: number;
    navMenuToggle: number;
    navMenuBackdrop: number;
    mobileMenu: number;
    mobileMenuToggle: number;
    mobileMenuBackdrop: number;
    appProgress: number;
}

export interface ThemeMobile {
    screenMaxWidth: string;
}

export interface ThemeMobileMenu {
    width: string;
    toggleSize: string;
}

export interface ThemeContainer {
    maxWidth: string;
}

export interface ThemeHeader {
    height: string;
    mobileHeight: string;
}

export interface ThemeFooter {
    minHeight: string;
}

export interface ThemeFonts {
    faBrands: string;
    roboto: string;
}

export interface ThemeAppProgress {
    color: string;
}

export interface ThemeOptions {
    palette: Palette;
    zIndex: ZIndex;
    mobile: ThemeMobile;
    mobileMenu: ThemeMobileMenu;
    container: ThemeContainer;
    header: ThemeHeader;
    footer: ThemeFooter;
    fonts: ThemeFonts;
    appProgress: ThemeAppProgress;
}
