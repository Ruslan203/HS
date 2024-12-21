import React from "react";
import {Field, FieldProps} from "@common/Field";

export type TextAreaFieldProps = Omit<FieldProps, "type">;

export const TextAreaField: React.FC<TextAreaFieldProps> = (props) => (
    <Field {...props} type="textarea" />
);
