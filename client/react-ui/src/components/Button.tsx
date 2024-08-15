import { useMemo } from "react";
import { CircularProgress } from "@mui/material";
import MuiButton, { type ButtonProps } from "@mui/material/Button";

export default function Button(props: { isLoading?: boolean } & ButtonProps) {

    // delete custom props
    const buttonProps = useMemo(() => {
        const originProps: Partial<typeof props> = { ...props };
        delete originProps.isLoading;
        return originProps as ButtonProps;
    }, [props]);

    return (
        <MuiButton
            variant="contained"
            {...buttonProps}
            startIcon={props.isLoading ? <CircularProgress size="1em" color="inherit" /> : props?.startIcon}
            disabled={props.isLoading || props.disabled}
        >{props?.children}</MuiButton>
    );
}