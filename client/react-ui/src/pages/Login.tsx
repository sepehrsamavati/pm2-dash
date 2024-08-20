import { useCallback, useRef, useState } from "react";
import UIText, { resultUIText } from "../core/i18n/UIText";
import { useForm } from "react-hook-form";
import colors from "../core/config/colors";
import Button from "../components/Button";
import { useSession } from "../core/Session";
import { ILoginDTO } from "@/common/types/dto";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import TextField from "../components/inputs/TextField";
import CenteredContent from "../components/CenteredContent";
import { formHookBaseConfig } from "../core/config/formHook";
import FormValidationHelper from "../core/helpers/FormValidationHelper";

const validations = {
    username: new FormValidationHelper<ILoginDTO, "username">().isRequired().maxLength(20).resolve(),
    password: new FormValidationHelper<ILoginDTO, "password">().isRequired().maxLength(32).resolve(),
} as const;

export default function Login() {
    const session = useSession();
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>(null);
    const form = useForm<ILoginDTO>(formHookBaseConfig);
    const [isLoading, setIsLoading] = useState(false);

    const login = useCallback((dto: ILoginDTO) => {
        setIsLoading(true);
        window.electronAPI
            .login(dto)
            .then(res => {
                if (res.ok)
                    navigate("/List");
                else
                    session.snackbarProvider(resultUIText(res), { variant: "error" });
            })
            .finally(() => setIsLoading(false));
    }, [session, navigate]);

    const cancelLogin = useCallback(() => {
        session.pm2Connection = undefined;
        navigate("/");
    }, [session, navigate]);

    return (
        <CenteredContent>
            <Box
                width="100%"
                maxWidth="400px"
                sx={{
                    padding: 2,
                    borderRadius: 2,
                    border: 2,
                    borderColor: colors.brand
                }}
            >
                <Typography
                    component="h2"
                    fontSize="1.6em"
                    sx={{
                        borderInlineStart: 3,
                        borderInlineStartStyle: 'dotted',
                        borderInlineStartColor: colors.brandSecondary,
                        padding: "0.3em"
                    }}
                >{UIText.login}</Typography>
                <form ref={formRef} onSubmit={form.handleSubmit(login)}>
                    <Grid container spacing={3} marginBlock={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="off"
                                form={formRef}
                                label={UIText.username}
                                errorMessage={form.formState.errors.username?.message}
                                formRegister={form.register("username", validations.username)}
                            ></TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                form={formRef}
                                type="password"
                                label={UIText.password}
                                errorMessage={form.formState.errors.password?.message}
                                formRegister={form.register("password", validations.password)}
                            ></TextField>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" onClick={cancelLogin} color="warning" startIcon={<ChevronLeft />}>{UIText.return}</Button>
                        </Grid>
                        <Grid item>
                            <Button type="submit" isLoading={isLoading} color="success" startIcon={<ChevronRight />}>{UIText.login}</Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </CenteredContent>
    );
}