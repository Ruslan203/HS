import React, {useEffect} from "react";
import styled from "styled-components";
import {AnimatePresence, motion} from "framer-motion";
import {useBody} from "@common/Body";

export const BackdropStyled = styled(motion.div)<{$zIndex?: number; disabled: boolean}>`
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background: rgba(30, 30, 30, 0.9);
    z-index: ${({theme, $zIndex}) => $zIndex ?? theme.zIndex.backdrop};
    cursor: ${({disabled}) => (disabled ? "not-allowed" : "default")};
`;

export interface BackdropProps {
    open: boolean;
    disabled?: boolean;
    animatePresence?: boolean;
    className?: string;
    zIndex?: number;
    onClick?: () => unknown;
    children?: React.ReactNode;
}

export const Backdrop: React.FC<BackdropProps> = ({
    open,
    disabled = false,
    animatePresence = true,
    className,
    zIndex,
    onClick,
    children
}) => {
    const body = useBody();

    useEffect(() => {
        if (open) {
            body.lockScroll();
        } else {
            body.unlockScroll();
        }

        return () => body.unlockScroll();
    }, [open]);

    const backdrop: React.ReactNode = open ? (
        <BackdropStyled
            className={className}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            disabled={disabled}
            $zIndex={zIndex}
            onClick={!disabled ? onClick : undefined}
        >
            {children}
        </BackdropStyled>
    ) : null;

    return animatePresence ? <AnimatePresence>{backdrop}</AnimatePresence> : backdrop;
};
