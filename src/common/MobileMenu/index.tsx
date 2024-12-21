import React, {useCallback, useMemo} from "react";
import styled from "styled-components";
import {AnimatePresence, motion} from "framer-motion";
import {Backdrop} from "@common/Backdrop";
import {Portal} from "@common/Portal";
import {Title} from "@common/Title";
import {AppProgressStyles} from "@common/app/Progress";
import {CloseIcon} from "@common/icons/Close";
import {useTheme} from "@common/theme";
import {IMobileMenuContext, MobileMenuProvider} from "./Context";

export const MobileMenuStyled = styled.div``;

export const MobileMenuBackdrop = styled(Backdrop)``;

export const MobileMenuDrawer = styled(motion.div)<{$zIndex?: number}>`
    display: flex;
    flex-direction: column;
    position: fixed;
    z-index: ${({theme, $zIndex}) => $zIndex ?? theme.zIndex.mobileMenu};
    top: 0px;
    bottom: 0px;
    width: 100%;
    max-width: ${({theme}) => theme.mobileMenu.width};
    background: white;
    padding: 30px;
`;

export const MobileMenuDrawerBody = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    padding-bottom: 30px;
    overflow: auto;
`;

export const MobileMenuDrawerHead = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid ${({theme}) => theme.palette.dividers};
`;

export const MobileMenuDrawerLabel = styled(Title)`
    font: bold 28px ${({theme}) => theme.fonts.roboto};
`;

export const MobileMenuDrawerCloseButton = styled.button`
    display: inline-flex;
    border: none;
    background: none;
    padding: 0px;
    cursor: pointer;
    fill: ${({theme}) => theme.palette.black};
`;

export const MobileMenuDrawerFooter = styled.div`
    display: flex;
    background: #f4f4f3;
    padding: 30px;
    margin: -30px;
    margin-top: 0px;
`;

export const MobileMenuDrawerFooterButtons = styled.div`
    display: flex;
    gap: 30px;
    width: 100%;
`;

export type MobileMenuSide = "left" | "right";

export interface MobileMenuProps {
    open: boolean;
    side?: MobileMenuSide;
    label?: string;
    drawerZIndex?: number;
    backdropZIndex?: number;
    footer?: React.ReactNode;
    children?: React.ReactNode | ((context: IMobileMenuContext) => React.ReactNode);
    onClose?: () => unknown;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
    open,
    side = "right",
    label,
    drawerZIndex,
    backdropZIndex,
    footer,
    children,
    onClose
}) => {
    const theme = useTheme();
    const closeMenu = useCallback(() => {
        onClose?.();
    }, [onClose]);
    const context = useMemo<IMobileMenuContext>(
        () => ({
            isForMobile: true,
            closeMenu
        }),
        [closeMenu]
    );

    return (
        <>
            <Portal>
                <MobileMenuProvider context={context}>
                    <AnimatePresence>
                        {open ? (
                            <MobileMenuStyled>
                                <MobileMenuBackdrop
                                    open={open}
                                    animatePresence={false}
                                    zIndex={backdropZIndex ?? theme.zIndex.mobileMenuBackdrop}
                                    onClick={onClose}
                                />
                                <MobileMenuDrawer
                                    initial="close"
                                    animate={open ? "open" : "close"}
                                    exit="close"
                                    variants={{
                                        open: {
                                            [side]: 0
                                        },
                                        close: {
                                            [side]: `-${theme.mobileMenu.width}`
                                        }
                                    }}
                                    $zIndex={drawerZIndex}
                                >
                                    {label ? (
                                        <MobileMenuDrawerHead>
                                            <MobileMenuDrawerLabel component="h3">
                                                {label}
                                            </MobileMenuDrawerLabel>
                                            <MobileMenuDrawerCloseButton onClick={onClose}>
                                                <CloseIcon />
                                            </MobileMenuDrawerCloseButton>
                                        </MobileMenuDrawerHead>
                                    ) : null}
                                    <MobileMenuDrawerBody>
                                        {typeof children === "function"
                                            ? children(context)
                                            : children}
                                    </MobileMenuDrawerBody>
                                    {footer}
                                </MobileMenuDrawer>
                                <AppProgressStyles color={theme.palette.primary} />
                            </MobileMenuStyled>
                        ) : null}
                    </AnimatePresence>
                </MobileMenuProvider>
            </Portal>
        </>
    );
};

export * from "./Context";
