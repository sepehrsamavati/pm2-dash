import type { UseFormRegisterReturn } from "react-hook-form";
import { type RefObject, useMemo, useState, useCallback } from "react";
import MuiTextField, { type TextFieldProps } from "@mui/material/TextField";


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
    const { ref: refCallback, onChange, ...register } = formRegister ?? {};
    const [autoFilled, setAutoFilled] = useState<true | undefined>(undefined);

    const hasError = useMemo(() => Boolean(errorMessage), [errorMessage]);

    const changeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

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
            onChange={changeHandler}
            ref={refCallback}
        />
    );
}