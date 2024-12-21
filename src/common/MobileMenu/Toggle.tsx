import React from "react";
import styled from "styled-components";
import {SVGMotionProps, motion} from "framer-motion";
import {useTheme} from "@common/theme";
import {MobileMenuElement} from "./Element";

export const MobileMenuToggleStyled = styled(MobileMenuElement)<{$zIndex?: number}>`
    display: inline-flex;
    position: relative;
    z-index: ${({theme, $zIndex}) => $zIndex ?? theme.zIndex.mobileMenuToggle};
    padding: 0px;
    border: none;
    background: none;
    cursor: pointer;
`;

export const Icon = styled(motion.svg)`
    display: inline-flex;
    width: ${({theme}) => theme.mobileMenu.toggleSize};
    height: ${({theme}) => theme.mobileMenu.toggleSize};
    stroke: ${({theme}) => theme.palette.black};
`;

export const IconLine: React.FC<SVGMotionProps<SVGPathElement>> = (props) => (
    <motion.path fill="transparent" strokeWidth="2" strokeLinecap="round" {...props} />
);

export type MobileMenuToggleColor = "white" | "black";

export interface MobileMenuToggleProps {
    open: boolean;
    color?: MobileMenuToggleColor;
    zIndex?: number;
    className?: string;
    onToggle?: () => unknown;
}

export const MobileMenuToggle: React.FC<MobileMenuToggleProps> = ({
    open,
    color = "white",
    zIndex,
    className,
    onToggle
}) => {
    const theme = useTheme();
    const iconColor: string = color === "white" ? theme.palette.white : theme.palette.black;

    return (
        <MobileMenuToggleStyled
            as={motion.button}
            className={className}
            aria-label="Переключатель бокового меню"
            initial={open ? "open" : "close"}
            animate={open ? "open" : "close"}
            $zIndex={zIndex}
            onClick={onToggle}
        >
            <Icon
                initial={{
                    stroke: iconColor
                }}
                animate={{
                    stroke: iconColor
                }}
                viewBox="0 0 23 23"
            >
                <IconLine
                    variants={{
                        open: {d: "M 3 16.5 L 17 2.5"},
                        close: {d: "M 2 2.5 L 20 2.5"}
                    }}
                />
                <IconLine
                    d="M 2 9.423 L 20 9.423"
                    variants={{
                        open: {opacity: 0},
                        close: {opacity: 1}
                    }}
                    transition={{duration: 0.1}}
                />
                <IconLine
                    variants={{
                        open: {d: "M 3 2.5 L 17 16.346"},
                        close: {d: "M 2 16.346 L 20 16.346"}
                    }}
                />
            </Icon>
        </MobileMenuToggleStyled>
    );
};
