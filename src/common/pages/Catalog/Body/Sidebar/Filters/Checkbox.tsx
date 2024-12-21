import React, {FC} from "react";
import Image from "next/image";
import styled from "styled-components";
import {Text} from "@common/Text";
import checkboxIcon from "./assets/checkbox-icon.svg";

interface TextProps {
    children: React.ReactNode;
    disabled?: boolean;
}

export const SidebarFiltersCheckboxStyled = styled.label`
    display: inline-flex;
    gap: 8px;
    align-items: center;
    cursor: pointer;
`;

export const SidebarFiltersCheckboxInputContainer = styled.span`
    display: inline-flex;
`;

export const SidebarFiltersCheckboxInputNative = styled.input`
    display: none;
`;

export const SidebarFiltersCheckboxIcon = styled(Image)`
    display: inline-flex;
`;

export const SidebarFiltersCheckboxInput = styled.span`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border: 2px solid rgba(36, 30, 12, 0.2);
    border-radius: 4px;
    ${SidebarFiltersCheckboxInputNative}:checked + & {
        border: none;
        background: ${({theme}) => theme.palette.black};
    }
    ${SidebarFiltersCheckboxInputNative}:not(:checked) + & {
        > ${SidebarFiltersCheckboxIcon} {
            display: none;
        }
    }
`;

export const SidebarFiltersCheckboxCount: FC<TextProps> = styled.sup`
    font: normal 9px ${({theme}) => theme.fonts.roboto};
    color: ${({theme}) => theme.palette.black};
    margin-left: 2px;
    ${(props) =>
        (props as TextProps).disabled &&
        `
            color: rgb(204, 204, 204);
    `}
`;

export const SidebarFiltersCheckboxLabel: FC<TextProps> = styled(Text)`
    ${(props) =>
        (props as TextProps).disabled &&
        `
            color: rgb(204, 204, 204);
    `}
`;

export interface SidebarFiltersCheckboxProps extends React.PropsWithChildren {
    count?: number;
    checked?: boolean;
    onChange?: () => unknown;
    disabled?: boolean;
}

export const SidebarFiltersCheckbox: React.FC<SidebarFiltersCheckboxProps> = ({
    count,
    checked,
    children,
    disabled,
    onChange
}) => (
    <SidebarFiltersCheckboxStyled>
        <SidebarFiltersCheckboxInputContainer>
            <SidebarFiltersCheckboxInputNative
                type="checkbox"
                disabled={disabled}
                checked={checked}
                onChange={onChange}
            />
            <SidebarFiltersCheckboxInput>
                <SidebarFiltersCheckboxIcon
                    src={checkboxIcon}
                    width={12}
                    height={10}
                    alt="Иконка галочки для фильтра"
                    priority
                />
            </SidebarFiltersCheckboxInput>
        </SidebarFiltersCheckboxInputContainer>
        <SidebarFiltersCheckboxLabel disabled={disabled}>
            {children}
            {count ? (
                <SidebarFiltersCheckboxCount disabled={disabled}>
                    {count}
                </SidebarFiltersCheckboxCount>
            ) : null}
        </SidebarFiltersCheckboxLabel>
    </SidebarFiltersCheckboxStyled>
);
