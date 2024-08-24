import { useCallback, useMemo, useState } from "react";
import Button from "../components/Button";
import colors from "../core/config/colors";
import { useSession } from "../core/Session";
import { useNavigate } from "react-router-dom";
import constants from "../core/config/constants";
import AppVersion from "../components/AppVersion";
import UIText, { resultUIText } from "../core/i18n/UIText";
import CenteredContent from "../components/CenteredContent";
import type { Pm2ConnectionType } from "@/common/types/ComInterface";
import { upsertTargetServer } from "../core/helpers/connectionHistory";
import { ChevronRight, ClearAll, Http, Terminal } from "@mui/icons-material";
import { Pm2HttpServerConnection, Pm2LocalIpcConnection } from "../core/Pm2Connection";
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
        connection.connect()
            .then(res => {
                if (res.ok) {
                    navigate("/List");
                    session.pm2Connection = connection;
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
    const defaultTargetServer = useMemo(() => {
        const history = session.localStorage.data.history;

        let protocol = "http", hostname = "localhost", port = "80";

        try {
            const server = history.at(history.length - 1);
            if (server) {
                const url = new URL(server.baseUrl);
                protocol = url.protocol.split(':')[0];
                hostname = url.hostname;
                port = url.port || "80";
            }
        } catch {
            session.localStorage.data.history = [];
            session.localStorage.rewrite();
        }

        return {
            protocol, hostname, port
        };
    }, [session]);
    const [protocol, setProtocol] = useState(defaultTargetServer.protocol);
    const [hostname, setHostname] = useState(defaultTargetServer.hostname);
    const [port, setPort] = useState(defaultTargetServer.port);

    const connect = useCallback(() => {
        props.lockForm(true);
        const connection = new Pm2HttpServerConnection();

        connection.protocol = protocol as typeof connection.protocol;
        connection.hostname = hostname;
        connection.port = port;

        connection.connect()
            .then(res => {
                if (res.ok) {
                    navigate("/Login");
                    session.localStorage.data.history = upsertTargetServer(session.localStorage.data.history, {
                        baseUrl: `${protocol}://${hostname}:${port}`
                    });
                    session.localStorage.rewrite();
                    session.pm2Connection = connection;
                } else {
                    session.snackbarProvider(resultUIText(res), { variant: "error" });
                }
            })
            .finally(() => props.lockForm(false));
    }, [props, session, navigate, protocol, hostname, port]);

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                connect();
            }}
        >
            <Grid container spacing={2}>
                {session.localStorage.data.history.length > 0 ? (
                    <>
                        <Grid item xs={8}>
                            <FormControl fullWidth>
                                <InputLabel>{UIText.history}</InputLabel>
                                <Select
                                    fullWidth
                                    label={UIText.history}
                                    disabled={props.isLoading}
                                    onChange={e => {
                                        const index = Number.parseInt(e.target.value as string);
                                        const item = session.localStorage.data.history.at(index);
                                        if (item) {
                                            try {
                                                const url = new URL(item.baseUrl);
                                                setProtocol(url.protocol.split(':')[0]);
                                                setHostname(url.hostname);
                                                setPort(url.port || "80");
                                            } catch { }
                                        }
                                    }}
                                >
                                    {session.localStorage.data.history.map((item, index) => <MenuItem key={index} value={index}>{item.baseUrl}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4} marginBlock="auto">
                            <Button
                                fullWidth
                                size="large"
                                variant="outlined"
                                startIcon={<ClearAll />}
                                onClick={() => {
                                    session.localStorage.data.history = [];
                                    session.localStorage.rewrite();
                                    session.refreshUI();
                                }}
                                color="warning">{UIText.clear}</Button>
                        </Grid>
                    </>
                ) : null}
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>{UIText.protocol}</InputLabel>
                        <Select
                            fullWidth
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
                    <Button type="submit" color="success" isLoading={props.isLoading} startIcon={<ChevronRight />} endIcon={<Http />}>{UIText.connect}</Button>
                </Grid>
            </Grid>
        </form>
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