import { useCallback, useState } from "react";
import UIText from "../core/i18n/UIText";
import Button from "../components/Button";
import colors from "../core/config/colors";
import { useSession } from "../core/Session";
import { useNavigate } from "react-router-dom";
import constants from "../core/config/constants";
import AppVersion from "../components/AppVersion";
import CenteredContent from "../components/CenteredContent";
import { Pm2HttpServerConnection, Pm2LocalIpcConnection } from "../core/Pm2Connection";
import { ChevronRight, Http, Terminal } from "@mui/icons-material";
import type { Pm2ConnectionType } from "@/common/types/ComInterface";
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";

function LocalIpcForm(props: {
    isLoading: boolean;
    lockForm: (lock: boolean) => void;
}) {
    const session = useSession();
    const navigate = useNavigate();

    const connect = useCallback(() => {
        props.lockForm(true);
        const connection = new Pm2LocalIpcConnection();
        session.pm2Connection = connection;
        connection.connect()
            .then(res => {
                if (res.ok) {
                    navigate("/List");
                }
            })
            .finally(() => props.lockForm(false));
    }, [props, session, navigate]);

    return (
        <Button
            color="success"
            isLoading={props.isLoading}
            startIcon={<ChevronRight />}
            endIcon={<Terminal />}
            onClick={connect}
        >{UIText.connect}</Button>
    );
}

function HttpServerForm(props: {
    isLoading: boolean;
    lockForm: (lock: boolean) => void;
}) {
    const session = useSession();
    const navigate = useNavigate();
    const [protocol, setProtocol] = useState("http");
    const [hostname, setHostname] = useState("localhost");
    const [port, setPort] = useState("80");

    const connect = useCallback(() => {
        props.lockForm(true);
        const connection = new Pm2HttpServerConnection();
        connection.protocol = protocol as typeof connection.protocol;
        connection.hostname = hostname;
        connection.port = port;
        session.pm2Connection = connection;
        connection.connect()
            .then(res => {
                if (res.ok) {
                    navigate("/List");
                }
            })
            .finally(() => props.lockForm(false));
    }, [props, session, navigate, protocol, hostname, port]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                    <InputLabel>{UIText.protocol}</InputLabel>
                    <Select
                        value={protocol}
                        label={UIText.protocol}
                        disabled={props.isLoading}
                        onChange={e => setProtocol(e.target.value)}
                    >
                        <MenuItem value="http">http</MenuItem>
                        <MenuItem value="https">https</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    value={port}
                    placeholder={UIText.port}
                    disabled={props.isLoading}
                    label={UIText.port}
                    onBlur={() => port === "" && setPort("80")}
                    onChange={e => {
                        const _port = Number.parseInt(e.target.value);

                        if (Number.isNaN(_port) || _port < 1 || _port > 65535)
                            return setPort("");

                        setPort(_port.toString());
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    value={hostname}
                    label={UIText.hostname}
                    disabled={props.isLoading}
                    onBlur={() => hostname === "" && setHostname("localhost")}
                    onChange={e => {
                        let _hostname = e.target.value;

                        try {
                            const url = new URL(`http://${_hostname}`);
                            _hostname = url.hostname;
                        } catch {
                            return setHostname("");
                        }

                        setHostname(_hostname);
                    }}
                />
            </Grid>
            <Grid item>
                <Button color="success" isLoading={props.isLoading} startIcon={<ChevronRight />} endIcon={<Http />} onClick={connect}>{UIText.connect}</Button>
            </Grid>
        </Grid>
    );
}

export default function Connect() {
    const [isLoading, setIsLoading] = useState(false);
    const [connectionType, setConnectionType] = useState<Pm2ConnectionType>("LOCAL_IPC");

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
                >{UIText.connectToPm2}</Typography>
                <Grid container spacing={3} marginBlock={2} justifyContent="end">
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>{UIText.type}</InputLabel>
                            <Select
                                value={connectionType}
                                label={UIText.type}
                                disabled={isLoading}
                                onChange={e => setConnectionType(e.target.value as Pm2ConnectionType)}
                            >
                                <MenuItem value={"LOCAL_IPC" satisfies Pm2ConnectionType}>Local IPC</MenuItem>
                                <MenuItem value={"HTTP_SERVER" satisfies Pm2ConnectionType}>HTTP server</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        {connectionType === "LOCAL_IPC" ? <LocalIpcForm isLoading={isLoading} lockForm={setIsLoading} /> : null}
                        {connectionType === "HTTP_SERVER" ? <HttpServerForm isLoading={isLoading} lockForm={setIsLoading} /> : null}
                    </Grid>
                </Grid>
                <Typography component="div" dir="ltr" fontSize="0.9em">
                    <span>{constants.appTitle} <sub style={{ display: "inline-block" }}><AppVersion /></sub></span>
                </Typography>
            </Box>
        </CenteredContent>
    );
}