import React from "react";
import styled, {css} from "styled-components";
import {Field, FieldProps} from "@common/Field";

export const SelectFieldOption = styled.option<{hidden?: boolean}>`
    color: ${({theme}) => theme.palette.black};
    ${({hidden}) =>
        hidden &&
        css`
            display: none;
        `}
`;

export type SelectFieldProps = Omit<FieldProps, "type">;

export const SelectField: React.FC<SelectFieldProps> = (props) => (
    <Field {...props} type="select" />
);
