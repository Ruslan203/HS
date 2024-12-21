import React from "react";
import styled from "styled-components";
import {css} from "styled-components";
import {AnimatePresence, motion} from "framer-motion";
import {Backdrop} from "@common/Backdrop";
import {Portal} from "@common/Portal";
import {CloseIcon} from "./icons/Close";

export const ModalStyled = styled(motion.div)`
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    z-index: ${({theme}) => theme.zIndex.modal};
`;

export interface ModalWindowProps {
    $width?: string;
    $mobileFullScreen: boolean;
}

export const ModalWindow = styled(motion.div)<ModalWindowProps>`
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    max-width: ${({$width}) => $width ?? "420px"};
    min-height: 100px;
    background: white;
    border-radius: 10px;
    z-index: ${({theme}) => theme.zIndex.modal};
    margin: 20px;
    overflow: hidden;
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        ${({$mobileFullScreen}) =>
            $mobileFullScreen &&
            css`
                margin: 0px;
                border-radius: 0px;
            `}
    }
`;

export const ModalBody = styled.div<{$mobileDisablePadding: boolean}>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    padding: 40px;
    padding-bottom: 30px;
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        padding: ${({$mobileDisablePadding}) => ($mobileDisablePadding ? "0px" : "30px 35px")};
    }
`;

export const ModalCloseButton = styled.button`
    display: inline-flex;
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 0px;
    border: none;
    background: none;
    cursor: pointer;
`;

export interface ModalProps extends React.PropsWithChildren {
    open: boolean;
    animatePresence?: boolean;
    width?: string;
    mobileFullScreen?: boolean;
    mobileDisablePadding?: boolean;
    onClose?: () => unknown;
}

export const Modal: React.FC<ModalProps> = ({
    open,
    animatePresence = true,
    width,
    mobileFullScreen = false,
    mobileDisablePadding = false,
    children,
    onClose
}) => {
    let modal: React.ReactNode;
    if (open) {
        modal = (
            <ModalStyled>
                <Backdrop open animatePresence={false} onClick={onClose} />
                <ModalWindow
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    $width={width}
                    $mobileFullScreen={mobileFullScreen}
                >
                    <ModalBody $mobileDisablePadding={mobileDisablePadding}>{children}</ModalBody>
                    <ModalCloseButton onClick={onClose}>
                        <CloseIcon />
                    </ModalCloseButton>
                </ModalWindow>
            </ModalStyled>
        );
    } else {
        modal = null;
    }

    return <Portal>{animatePresence ? <AnimatePresence>{modal}</AnimatePresence> : modal}</Portal>;
};

export * from "./hooks/useModalState";
