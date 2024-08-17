import React from 'react'
import { useSnackbar, type ProviderContext, type OptionsWithExtraProps, type VariantType, type SnackbarMessage, type SnackbarKey } from 'notistack'

let useSnackbarRef: ProviderContext;
export const SnackbarProviderConfigurator: React.FC = () => {
    useSnackbarRef = useSnackbar();
    return null;
}

type ExtendedOptions = {
    title?: string;
    multiline?: boolean;
};

const snackbarProvider = (msg: SnackbarMessage, options?: { extendedOptions?: ExtendedOptions } & OptionsWithExtraProps<VariantType>) => {
    const defaultOptions: OptionsWithExtraProps<VariantType> = {
        variant: "default",
        autoHideDuration: 8e3,
        anchorOrigin: {
            vertical: "bottom",
            horizontal: "right"
        }
    };

    const { extendedOptions } = options ?? {};
    if (extendedOptions?.multiline && typeof msg === "string") {
        // add <br /> instead of \n
        const lines = msg.split('\n');
        const elements = lines.flatMap((item, index) => (index === lines.length - 1 ? [item] : [item, React.createElement('br')]));

        // add title
        if (extendedOptions.title) {
            elements.unshift(React.createElement('h3', {}, [extendedOptions.title]));
        }

        msg = React.createElement('div', {}, elements);
    }

    return useSnackbarRef.enqueueSnackbar<VariantType>(msg, options ? { ...defaultOptions, ...options } : defaultOptions);
};

export const closeSnackbar = (key: SnackbarKey) => {
    return useSnackbarRef.closeSnackbar();
};

export default snackbarProvider;