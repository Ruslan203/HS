import React from "react";
import styled from "styled-components";
import {ArrowDown2Icon} from "@common/icons/ArrowDown2";

export const SelectStyled = styled.select`
    display: inline-flex;
    background: none;
    appearance: none;
    font: normal 14px ${({theme}) => theme.fonts.roboto};
    padding: 4px;
    padding-right: 40px;
    border: none;
    color: ${({theme}) => theme.palette.black};
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    letter-spacing: 0.1px;
`;

export const SelectContainer = styled.label`
    display: inline-flex;
    position: relative;
    align-items: center;
    cursor: pointer;
`;

export const SelectArrow = styled(ArrowDown2Icon)`
    display: inline-flex;
    position: absolute;
    right: 4px;
    pointer-events: none;
`;

export const Option = styled.option`
    color: ${({theme}) => theme.palette.black};
`;

export const Select: React.FC<Omit<React.ComponentProps<"select">, "ref">> = ({
    children,
    ...props
}) => (
    <SelectContainer>
        <SelectStyled {...props}>{children}</SelectStyled>
        <SelectArrow />
    </SelectContainer>
);
