import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import Image from "next/image";
import styled, {css} from "styled-components";
import {motion} from "framer-motion";
import {CircularProgress} from "@common/CircularProgress";
import {Link} from "@common/Link";
import {useMobileMenu} from "@common/MobileMenu";
import {Text} from "@common/Text";
import {useApi} from "@common/api";
import {useAuth} from "@common/auth";
import userDefaultAvatar from "@common/pages/Profile/Sidebar/assets/user-default-avatar.jpg";
import userLogoutIcon from "./assets/user-logout-icon.svg";
import userProfileIcon from "./assets/user-profile-icon.svg";

export const userAvatarSize = "44px";

export const UserMenuContainer = styled(motion.div)`
    display: flex;
    position: relative;
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        margin-right: 5px;
    }
`;

export const UserMenuOffset = styled.div`
    display: flex;
    width: ${userAvatarSize};
    height: ${({theme}) => theme.header.height};
`;

export const UserMenuStyled = styled(motion.div)<{$menuOpened: boolean}>`
    display: flex;
    position: absolute;
    right: 0px;
    border-radius: 0px 0px 8px 8px;
    overflow: hidden;
    ${({$menuOpened}) =>
        $menuOpened
            ? css`
                  flex-direction: column;
                  width: auto;
                  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16);
              `
            : css`
                  width: ${userAvatarSize};
              `}
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        border-radius: 8px;
        flex-direction: column-reverse;
        bottom: 0px;
    }
`;

export const UserMenuHead = styled.div<{$menuOpened: boolean}>`
    display: flex;
    align-items: center;
    height: ${({theme}) => theme.header.height};
    ${({$menuOpened}) =>
        $menuOpened
            ? css`
                  width: 100%;
                  padding: 16px;
              `
            : css`
                  cursor: pointer;
                  > ${UserMenuName} {
                      display: none;
                  }
              `}
`;

export const UserMenuAvatar = styled(Image)`
    display: inline-flex;
    width: ${userAvatarSize};
    height: ${userAvatarSize};
    border-radius: 50%;
`;

export const UserMenuName = styled(Text)`
    display: inline-flex;
    min-width: 180px;
    margin-left: 16px;
    font: 500 16px ${({theme}) => theme.fonts.roboto};
    color: ${({theme}) => theme.palette.black};
`;

export const UserMenuBody = styled(motion.div)<{$menuOpened: boolean}>`
    display: flex;
    width: 100%;
    ${({$menuOpened}) =>
        !$menuOpened &&
        css`
            opacity: 0 !important;
        `}
`;

export const UserMenuList = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        flex-direction: column-reverse;
    }
`;

export interface UserMenuItemProps {
    $transparent?: boolean;
    $loading?: boolean;
}

export const UserMenuItem = styled.button<UserMenuItemProps>`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 22px 26px;
    border: none;
    background: none;
    cursor: ${({$loading}) => ($loading ? "progress" : "pointer")};
    border-top: 1px solid ${({theme}) => theme.palette.dividers};
    ${({$transparent}) =>
        $transparent &&
        css`
            ${UserMenuIcon}, ${UserMenuText} {
                opacity: 0.45;
            }
        `}
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        border-top: none;
        border-bottom: 1px solid ${({theme}) => theme.palette.dividers};
    }
`;

export const UserMenuItemLeft = styled.span`
    display: inline-flex;
`;

export const UserMenuItemRight = styled.span`
    display: inline-flex;
    width: 100%;
    justify-content: flex-end;
`;

export const UserMenuIcon = styled(Image)`
    display: inline-flex;
    width: 20px;
    height: 20px;
    object-fit: contain;
    margin-left: 5px;
    margin-right: 30px;
`;

export const UserMenuText = styled(Text)`
    font: normal 16px ${({theme}) => theme.fonts.roboto};
    color: ${({theme}) => theme.palette.black};
    line-height: 1.5;
`;

export const UserMenuProgress = styled(CircularProgress)``;

export const UserMenu: React.FC = () => {
    const api = useApi();
    const {logoutUser, isLogoutLoading, userInfo} = useAuth();
    const {closeMenu: closeMobileMenu} = useMobileMenu();

    const menuRef = useRef<HTMLDivElement>(null);
    const [menuOpened, setMenuOpened] = useState(false);
    const openMenu = useCallback(() => {
        setMenuOpened(true);
    }, []);
    const closeMenu = useCallback(() => {
        setMenuOpened(false);
    }, []);

    const userFullName = useMemo<string | null>(() => {
        if (userInfo !== false) {
            return api.user.utils.getFullName({info: userInfo});
        } else {
            return null;
        }
    }, [api, userInfo]);

    const handleProfile = useCallback(() => {
        closeMobileMenu();
        closeMenu();
    }, [closeMobileMenu, closeMenu]);
    const handleLogout = useCallback(() => {
        logoutUser();
        closeMobileMenu();
        closeMenu();
    }, [closeMobileMenu, closeMenu, logoutUser]);

    useEffect(() => {
        const menuEl: HTMLDivElement | null = menuRef.current;
        if (menuEl === null) {
            return;
        }

        const blurListener = (event: Event) => {
            if (!menuEl.contains(event.target as HTMLElement)) {
                closeMenu();
            }
        };

        document.addEventListener("click", blurListener);

        return () => document.removeEventListener("click", blurListener);
    }, [menuRef]);

    return (
        <UserMenuContainer animate={menuOpened ? "open" : "close"}>
            <UserMenuStyled
                ref={menuRef}
                variants={{
                    open: {
                        background: "rgba(255, 255, 255, 1)",
                        width: "255px"
                    },
                    close: {
                        background: "rgba(255, 255, 255, 0.0)",
                        width: userAvatarSize
                    }
                }}
                animate={menuOpened ? "open" : "close"}
                $menuOpened={menuOpened}
            >
                <UserMenuHead $menuOpened={menuOpened} onClick={openMenu}>
                    <UserMenuAvatar
                        src={userDefaultAvatar}
                        width={48}
                        height={48}
                        alt="Аватарка пользователя"
                        priority
                    />
                    {userFullName ? <UserMenuName>{userFullName}</UserMenuName> : null}
                </UserMenuHead>
                <UserMenuBody
                    initial={menuOpened ? "open" : "close"}
                    animate={menuOpened ? "open" : "close"}
                    variants={{
                        open: {
                            display: "flex",
                            opacity: 1
                        },
                        close: {
                            opacity: 0,
                            transitionEnd: {
                                display: "none"
                            }
                        }
                    }}
                    $menuOpened={menuOpened}
                >
                    <UserMenuList>
                        <UserMenuItem as={Link} href="/profile" onClick={handleProfile}>
                            <UserMenuIcon
                                src={userProfileIcon}
                                width={20}
                                height={20}
                                alt="Иконка профиля"
                                unoptimized
                                priority
                            />
                            <UserMenuText>Профиль</UserMenuText>
                        </UserMenuItem>
                        <UserMenuItem
                            $transparent
                            $loading={isLogoutLoading}
                            disabled={isLogoutLoading}
                            onClick={handleLogout}
                        >
                            <UserMenuItemLeft>
                                <UserMenuIcon
                                    src={userLogoutIcon}
                                    width={20}
                                    height={20}
                                    alt="Иконка выхода пользователя"
                                    unoptimized
                                    priority
                                />
                                <UserMenuText>Выйти</UserMenuText>
                            </UserMenuItemLeft>
                            {isLogoutLoading ? (
                                <UserMenuItemRight>
                                    <UserMenuProgress size={20} />
                                </UserMenuItemRight>
                            ) : null}
                        </UserMenuItem>
                    </UserMenuList>
                </UserMenuBody>
            </UserMenuStyled>
            <UserMenuOffset />
        </UserMenuContainer>
    );
};
