import type { UseFormRegisterReturn } from "react-hook-form";
import MuiTextField, { type TextFieldProps } from "@mui/material/TextField";
import { type RefObject, useMemo, useState, useEffect, useCallback } from "react";

const EMPTY_STRING = '';

export type WithForm = {
    /** Used to get form reset event */
    form?: RefObject<HTMLFormElement>;
    /** Form hook field register */
    formRegister?: UseFormRegisterReturn;
    /** Nullable error message */
    errorMessage?: string;
}

export default function TextField(props: WithForm & TextFieldProps) {
    const { errorMessage, formRegister, form, ..._props } = props;
    // const [value, setValue] = useState(props.value ?? props.defaultValue ?? EMPTY_STRING);
    const { ref: refCallback, onChange, ...register } = formRegister ?? {};
    const [autoFilled, setAutoFilled] = useState<true | undefined>(undefined);

    const hasError = useMemo(() => Boolean(errorMessage), [errorMessage]);

    const changeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // const value = e.target.value;
        // setValue(value);
        if (formRegister?.onChange)
            formRegister.onChange(e);
        if (props.onChange)
            props.onChange(e);
    }, [props, formRegister]);

    const animationStartHandler = useCallback((e: React.AnimationEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // solution source: https://stackoverflow.com/questions/76830737/chrome-autofill-causes-textbox-collision-for-textfield-label-and-value
        const _autoFilled = !!(e.target as HTMLInputElement)?.matches("*:-webkit-autofill");
        if (_autoFilled === true && (e.animationName === "mui-auto-fill" || e.animationName === "mui-auto-fill-cancel")) {
            setAutoFilled(_autoFilled);
        }
    }, []);

    // useEffect(() => {
    //     if (!props.form?.current) return;
    //     const resetHandler = () => {
    //         setValue(EMPTY_STRING);
    //     };
    //     props.form.current.addEventListener('reset', resetHandler);
    //     return () => {
    //         props.form?.current?.removeEventListener('reset', resetHandler);
    //     };
    // }, [props]);

    return (
        <MuiTextField
            fullWidth
            error={hasError}
            helperText={props?.errorMessage}
            inputProps={{
                onAnimationStart: animationStartHandler
            }}
            InputLabelProps={{
                shrink: autoFilled
            }}
            {..._props}
            {...register}
            defaultValue={props.defaultValue}
            // value={props.value ?? value}
            onChange={changeHandler}
            ref={refCallback}
        />
    );
}