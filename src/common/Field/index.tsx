import React, {useCallback, useRef, useState} from "react";
import InputMask from "react-input-mask";
import styled, {css} from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";
import {useField, useFormikContext} from "formik";
import searchIcon from "./assets/search-icon.svg";

export interface FieldStyledProps {
    fullWidth: boolean;
    disabled: boolean;
    $hidden: boolean;
}

export const FieldStyled = styled.span<FieldStyledProps>`
    display: ${({$hidden}) => ($hidden ? "none" : "flex")};
    flex-direction: column;
    align-items: flex-start;
    font: normal 16px ${({theme}) => theme.fonts.roboto};
    width: ${({fullWidth}) => (fullWidth ? "100%" : "200px")};
    cursor: ${({disabled}) => (disabled ? "not-allowed" : "default")};
`;

export const FieldLabelContainer = styled.label`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`;

export interface FieldInputContainerProps {
    type: FieldType;
    error: boolean;
    $focus: boolean;
}

export const FieldInputContainer = styled.label<FieldInputContainerProps>`
    display: inline-flex;
    align-items: center;
    background: while;
    border: 2px solid
        ${({theme, error, $focus}) => {
            if (error) {
                return theme.palette.red;
            } else if ($focus) {
                return theme.palette.primaryLight;
            } else {
                return "#d3d2ce";
            }
        }};
    border-radius: 8px;
    width: 100%;
    overflow: hidden;
    background: white;
    ${({type}) =>
        type === "select" &&
        css`
            cursor: pointer;
        `}
`;

export const FieldInput = styled.input`
    display: inline-flex;
    background: while;
    border: none;
    padding: 12px 16px;
    width: 100%;
    outline: none;
    cursor: ${({disabled}) => (disabled ? "not-allowed" : "text")};
    color: ${({theme}) => theme.palette.black};
    &::placeholder {
        color: #757575;
    }
    &[type="search"]::-webkit-search-decoration,
    &[type="search"]::-webkit-search-cancel-button,
    &[type="search"]::-webkit-search-results-button,
    &[type="search"]::-webkit-search-results-decoration {
        -webkit-appearance: none;
    }
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 100px white inset !important;
    }
`;

export const FieldInputSelectContainer = styled.div<{focus: boolean}>`
    display: none;
    width: 100%;
    position: relative;
    ${({focus}) =>
        focus &&
        css`
            display: flex;
        `}
`;

export const FieldInputSelect = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    position: absolute;
    top: 5px;
    background: ${({theme}) => theme.palette.white};
    padding: 6px 0px;
    overflow: auto;
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2);
    max-height: 300px;
    border: 1px solid ${({theme}) => theme.palette.dividers};
`;

export const FieldInputOption = styled.div`
    display: inline-flex;
    font: normal 16px ${({theme}) => theme.fonts.roboto};
    line-height: 1.5;
    color: ${({theme}) => theme.palette.black};
    padding: 4px 10px;
    cursor: pointer;
    &:hover {
        background: ${({theme}) => theme.palette.primary};
        color: ${({theme}) => theme.palette.white};
    }
`;

export const FieldSelect = styled.select`
    display: inline-flex;
    width: 100%;
    border: none;
    padding: 12px 16px;
    margin-right: 16px;
    outline: none;
    cursor: pointer;
    background: white;
    color: ${({theme}) => theme.palette.black};
`;

export const FieldTextArea = styled.textarea`
    display: inline-flex;
    width: 100%;
    border: none;
    outline: none;
    padding: 12px 16px;
    min-width: 100%;
    min-height: 120px;
    color: ${({theme}) => theme.palette.black};
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 100px white inset !important;
    }
`;

export const FieldLabel = styled.span`
    color: ${({theme}) => theme.palette.black};
    margin-bottom: 5px;
`;

export const FieldError = styled.span`
    color: ${({theme}) => theme.palette.red};
    font-size: 12px;
    padding-left: 6px;
    margin-top: 5px;
`;

export const FieldSearchIcon = styled.span`
    display: inline-flex;
    flex-shrink: 0;
    width: 19px;
    height: 19px;
    background-position: center center;
    background-image: url(${searchIcon.src});
    background-repeat: no-repeat;
    margin-left: 15px;
`;

export const FieldLoadIndicatorContainer = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;
`;

export const FieldLoadIndicator = styled(CircularProgress)`
    display: inline-flex;
    position: absolute;
    right: 16px;
    width: 16px !important;
    height: 16px !important;
    cursor: progress;
    color: ${({theme}) => theme.palette.primary} !important;
`;

export const FieldBefore = styled.span`
    margin-bottom: 6px;
`;

export const FieldAfter = styled.span`
    display: inline-flex;
    margin-top: 6px;
`;

export interface FieldInputProps {
    value?: string;
    defaultValue?: string;
    name?: string;
    placeholder?: string;
    disabled?: boolean;
    min?: string;
    max?: string;
    loading?: boolean;
    onChange?: (event: React.ChangeEvent) => unknown;
    onFocus?: (event: React.FocusEvent) => unknown;
    onBlur?: (event: React.FocusEvent) => unknown;
}

export type FieldType = "text" | "password" | "number" | "search" | "select" | "textarea";

export interface FieldOption {
    id?: number | string;
    label?: string;
    value: string | number;
}

export interface FieldProps extends FieldInputProps, React.PropsWithChildren {
    type?: FieldType;
    className?: string;
    label?: string;
    error?: string;
    fullWidth?: boolean;
    formik?: boolean;
    mask?: string | null;
    options?: FieldOption[];
    hidden?: boolean;
    before?: React.ReactNode;
    after?: React.ReactNode;
    autoComplete?: string;
    onOptionSelect?: (option: FieldOption) => unknown;
    onInputBlur?: (event: React.FocusEvent) => unknown;
    onClick?: (event: React.MouseEvent) => unknown;
}

export const Field: React.FC<FieldProps> = (props) => {
    const {
        type = "text",
        className,
        label,
        error,
        name,
        formik = false,
        fullWidth = false,
        disabled = false,
        value,
        defaultValue,
        placeholder,
        min,
        max,
        mask,
        options,
        loading = false,
        hidden = false,
        after,
        before,
        autoComplete,
        children,
        onChange,
        onFocus,
        onBlur,
        onOptionSelect,
        onInputBlur,
        onClick
    } = props;

    if (formik && name) {
        try {
            const {isSubmitting} = useFormikContext();
            const [{value, onChange, onBlur}, meta] = useField(name);

            return (
                <Field
                    {...props}
                    value={value}
                    formik={false}
                    error={meta.touched ? meta.error : undefined}
                    disabled={isSubmitting}
                    onChange={onChange}
                    onInputBlur={onBlur}
                />
            );
        } catch (error) {
            return <Field {...props} formik={false} />;
        }
    }

    const labelRef = useRef<HTMLLabelElement>(null);

    const maskProps: React.ComponentProps<typeof FieldInput> = {};
    if (mask) {
        maskProps.as = InputMask;
        maskProps.mask = mask;
    }

    const [focus, setFocus] = useState(false);

    const handleFocus = useCallback(
        (event: React.FocusEvent) => {
            onFocus?.(event);
            setFocus(true);
        },
        [onFocus]
    );
    const handleBlur = useCallback(
        (event: React.FocusEvent) => {
            onBlur?.(event);
            setFocus(false);
        },
        [onBlur]
    );

    const handleOptionSelect = useCallback(
        (option: FieldOption, event: React.MouseEvent) => {
            event.preventDefault();
            onOptionSelect?.(option);
            labelRef.current?.blur();
        },
        [onOptionSelect, labelRef]
    );

    return (
        <FieldStyled
            className={className}
            fullWidth={fullWidth}
            disabled={disabled}
            $hidden={hidden}
        >
            {label ? <FieldLabel>{label}</FieldLabel> : null}
            {before ? <FieldBefore>{before}</FieldBefore> : null}
            <FieldLabelContainer
                id={name}
                ref={labelRef}
                tabIndex={-1}
                onFocus={handleFocus}
                onBlur={handleBlur}
            >
                <FieldInputContainer type={type} error={!!error} $focus={focus}>
                    {type === "search" ? <FieldSearchIcon /> : null}
                    {type === "select" ? (
                        <FieldSelect
                            name={name}
                            disabled={disabled}
                            value={value}
                            defaultValue={defaultValue}
                            onBlur={onInputBlur}
                            onChange={onChange}
                            onClick={onClick}
                        >
                            {children}
                        </FieldSelect>
                    ) : type === "textarea" ? (
                        <FieldTextArea
                            name={name}
                            defaultValue={defaultValue ?? value}
                            disabled={disabled}
                            placeholder={placeholder}
                            onBlur={onInputBlur}
                            onChange={onChange}
                            onClick={onClick}
                        />
                    ) : (
                        <FieldInput
                            name={name}
                            type={type}
                            value={value}
                            defaultValue={defaultValue}
                            disabled={disabled}
                            placeholder={placeholder}
                            min={min}
                            max={max}
                            autoComplete={autoComplete}
                            onBlur={onInputBlur}
                            onChange={onChange}
                            onClick={onClick}
                            {...maskProps}
                        />
                    )}
                    {loading ? (
                        <FieldLoadIndicatorContainer>
                            <FieldLoadIndicator />
                        </FieldLoadIndicatorContainer>
                    ) : null}
                </FieldInputContainer>
                {options?.length ? (
                    <FieldInputSelectContainer focus={focus}>
                        <FieldInputSelect>
                            {options.map((option, index) => (
                                <FieldInputOption
                                    key={option.id ?? index}
                                    onClick={handleOptionSelect.bind(null, option)}
                                >
                                    {option.label ?? option.value}
                                </FieldInputOption>
                            ))}
                        </FieldInputSelect>
                    </FieldInputSelectContainer>
                ) : null}
            </FieldLabelContainer>
            {error ? <FieldError>{error}</FieldError> : null}
            {after ? <FieldAfter>{after}</FieldAfter> : null}
        </FieldStyled>
    );
};
