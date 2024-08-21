import FormHelperText from "@mui/material/FormHelperText";

export default function InputError(props?: {
    errorMessage?: string;
}) {
    if (!props?.errorMessage)
        return null;
    return <FormHelperText error>{props?.errorMessage}</FormHelperText>;
}