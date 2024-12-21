import React, {useContext, useMemo} from "react";
import {usePathname} from "next/navigation";
import styled, {css} from "styled-components";
import urlJoin from "url-join";
import {Link, LinkProps} from "@common/Link";
import {IMobileMenuContext, MobileMenu, useMobileMenu} from "@common/MobileMenu";
import {MobileMenuDesktopElement} from "@common/MobileMenu/Element";
import {MobileMenuNav, MobileMenuNavLink} from "@common/MobileMenu/Nav";
import {useTheme} from "@common/theme";
import {useHeader} from ".";

export const DesktopNav = styled(MobileMenuDesktopElement)`
    display: flex;
    gap: 24px;
`;

export const DesktopNavLink = styled(Link)<{$active: boolean}>`
    color: ${({theme}) => theme.palette.white};
    position: relative;
    ${({theme, $active}) =>
        $active &&
        css`
            &:after {
                display: flex;
                margin-top: 1px;
                width: 100%;
                height: 3px;
                background: ${theme.palette.white};
                position: absolute;
                content: "";
            }
        `}
`;

export const NavLink: React.FC<Omit<LinkProps, "as" | "ref">> = (props) => {
    const {href} = props;
    const pathname = usePathname();
    const {isForMobile} = useMobileMenu();
    const active = useMemo<boolean>(() => {
        let active = true;
        const pathnameParts: string[] = urlJoin(pathname, "/").split("/").slice(1, -1);
        const hrefParts: string[] = urlJoin(href.toString(), "/").split("/").slice(1, -1);

        for (let index = 0; index < hrefParts.length; index++) {
            active &&= hrefParts[index] === pathnameParts[index];
        }

        return active;
    }, [pathname, href]);

    if (isForMobile) {
        return <MobileMenuNavLink {...props} active={active} />;
    } else {
        return <DesktopNavLink {...props} $active={active} />;
    }
};

export interface NavProps {
    children?: React.ReactNode | ((context: IMobileMenuContext) => React.ReactNode);
}

export const Nav: React.FC<NavProps> = ({children}) => {
    const theme = useTheme();
    const {menuOpened, closeMenu} = useHeader();
    const menuContext = useMobileMenu();

    return (
        <NavProvider>
            <DesktopNav as="nav">
                {typeof children === "function" ? children(menuContext) : children}
            </DesktopNav>
            <MobileMenu
                open={menuOpened}
                side="left"
                drawerZIndex={theme.zIndex.navMenu}
                backdropZIndex={theme.zIndex.navMenuBackdrop}
                onClose={closeMenu}
            >
                {(context) => (
                    <MobileMenuNav as="nav">
                        {typeof children === "function" ? children(context) : children}
                    </MobileMenuNav>
                )}
            </MobileMenu>
        </NavProvider>
    );
};

export const NavContext = React.createContext<boolean>(false);

export const NavProvider: React.FC<React.PropsWithChildren> = ({children}) => (
    <NavContext.Provider value={true}>{children}</NavContext.Provider>
);

export const isNavContext = () => useContext(NavContext);
