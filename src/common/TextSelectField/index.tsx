import React, {useCallback, useEffect, useState} from "react";
import {useField, useFormikContext} from "formik";
import {Field, FieldOption, FieldProps} from "@common/Field";

export type TextSelectFieldLoadOptions = (query: string) => Promise<FieldOption[]>;

export interface TextSelectFieldProps
    extends Omit<FieldProps, "formik" | "type" | "loading" | "name" | "value" | "defaultValue"> {
    name?: string;
    formik?: boolean;
    loadOptions: TextSelectFieldLoadOptions;
    option?: FieldOption | null;
    defaultOption?: FieldOption | null;
    setOption?: (option: FieldOption | null) => void;
}

export const TextSelectField: React.FC<TextSelectFieldProps> = (props) => {
    const {
        name,
        formik,
        option = null,
        defaultOption = null,
        setOption,
        onFocus,
        onBlur,
        ...fieldProps
    } = props;

    if (name && formik) {
        try {
            const {isSubmitting} = useFormikContext();
            const [{value, onBlur}, meta, {setValue}] = useField(name);

            return (
                <TextSelectField
                    {...props}
                    formik={false}
                    option={value}
                    setOption={setValue}
                    error={meta.touched ? meta.error : undefined}
                    disabled={isSubmitting}
                    onInputBlur={onBlur}
                />
            );
        } catch (error) {
            return <TextSelectField {...props} formik={false} />;
        }
    }

    const [currentOption, setCurrentOption] =
        option !== undefined && setOption
            ? [option, setOption]
            : useState<FieldOption | null>(defaultOption);
    const [value, setValue] = useState("");
    const [optionsLoaded, setOptionsLoaded] = useState(true);
    const [options, setOptions] = useState<FieldOption[]>([]);
    const [focus, setFocus] = useState(false);

    const loadOptions = useCallback(
        async (query: string) => {
            setOptionsLoaded(false);

            const options: FieldOption[] = await props.loadOptions(query);
            setOptions(options);
            setOptionsLoaded(true);
        },
        [props.loadOptions, currentOption]
    );

    const handleFocus = useCallback(
        (event: React.FocusEvent) => {
            onFocus?.(event);
            setFocus(true);
            loadOptions(value);
        },
        [onFocus, loadOptions, value]
    );
    const handleBlur = useCallback(
        (event: React.FocusEvent) => {
            onBlur?.(event);
            setFocus(false);
        },
        [onBlur]
    );
    const handleChange = useCallback((event: React.ChangeEvent) => {
        setValue((event.target as HTMLInputElement).value);
        setCurrentOption(null);
    }, []);

    useEffect(() => {
        if (focus && !currentOption) {
            loadOptions(value);
        }
    }, [value, focus, currentOption]);
    useEffect(() => {
        if (currentOption !== null) {
            setValue(currentOption.label ?? currentOption.value?.toString() ?? "");
        }
    }, [currentOption]);

    return (
        <Field
            {...fieldProps}
            type="text"
            name={name}
            options={options}
            loading={!optionsLoaded}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onOptionSelect={setCurrentOption}
        />
    );
};
