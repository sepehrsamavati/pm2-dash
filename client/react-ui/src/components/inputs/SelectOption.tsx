import InputError from "./InputError";
import UIText from "../../core/i18n/UIText";
import type { WithForm } from "./TextField";
import type { UseFormReturn } from "react-hook-form";
import { useEffect, useId, useMemo, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const EMPTY_STRING = '';

type SelectOptionWithForm = Omit<WithForm, 'errorMessage'> & {
    /** @deprecated Use formInstance */
    errorMessage?: string;
    /** Used to fix on change validation issue */
    formInstance?: {
        fieldKey: string;
        instance: UseFormReturn<any, any, undefined>;
    };
}

export default function SelectOption<TValue extends (string | number)>(props: SelectOptionWithForm & {
    defaultValue?: TValue;
    optional?: boolean;
    disabled?: boolean;
    multiple?: boolean;
    label?: string;
    value?: TValue;
    onChange?: (value: TValue) => void;
    options: [TValue, string][];
    size?: "small";
    disableFullWidth?: boolean;
}) {
    const id = useId();
    const [value, setValue] = useState(props.value ?? props.defaultValue ?? (props.optional && EMPTY_STRING));
    const { ref: refCallback, onChange, ...register } = props.formRegister ?? {};

    const errorMessage = useMemo(() => (
        props.formInstance
            ? props.formInstance.instance.formState.errors[props.formInstance.fieldKey]?.message as string
            : props.errorMessage
    ), [props]);

    const hasError = useMemo(() => Boolean(errorMessage), [errorMessage]);

    useEffect(() => {
        if (!props.form?.current) return;
        const resetHandler = () => {
            setValue(EMPTY_STRING);
        };
        props.form.current.addEventListener('reset', resetHandler);
        return () => {
            props.form?.current?.removeEventListener('reset', resetHandler);
        };
    }, [props]);

    return (
        <FormControl fullWidth={!props.disableFullWidth}>
            <InputLabel id={id}>{props.label}</InputLabel>
            <Select
                size={props.size}
                labelId={id}
                error={hasError}
                label={props.label}
                value={props.value ?? value ?? EMPTY_STRING}
                disabled={props.disabled}
                {...register}
                ref={refCallback}
                onChange={(e) => {
                    const value = e.target.value as TValue;
                    setValue(value);

                    if (props.formInstance) {
                        props.formInstance.instance.setValue(props.formInstance.fieldKey, value, { shouldValidate: true });
                    } else if (props.formRegister?.onChange) {
                        props.formRegister.onChange(e);
                    }

                    if (props.onChange)
                        props.onChange(value);
                }}
            >
                {props.optional ? (
                    <MenuItem value={EMPTY_STRING}>
                        <em>{UIText.none}</em>
                    </MenuItem>
                ) : null}
                {props.options.map(([value, uiText]) => (
                    <MenuItem key={value} value={value}>{uiText}</MenuItem>
                ))}
            </Select>
            <InputError errorMessage={errorMessage} />
        </FormControl>
    );
}