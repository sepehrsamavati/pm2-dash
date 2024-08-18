import Button from "../Button";
import UIText from "../../core/i18n/UIText";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../core/Session";
import { CancelPresentation, Http, Terminal } from "@mui/icons-material";
import { AppBar as MuiAppBar, Toolbar, AppBarProps as MuiAppBarProps, styled, Stack, Chip, Tooltip, Box, Switch } from "@mui/material";

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: "100%",
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export default function Header() {
    const session = useSession();
    const navigate = useNavigate();
    const [isDisconnecting, setIsDisconnecting] = useState(false);

    const disconnect = useCallback(() => {
        if (!session.pm2Connection)
            return;

        setIsDisconnecting(true);
        session.pm2Connection
            .disconnect()
            .then(res => {
                if (res.ok) {
                    navigate("/");
                    session.pm2Connection = undefined;
                }
            })
            .finally(() => setIsDisconnecting(false));

    }, [session, navigate]);

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Stack direction="row" alignItems="center" spacing={2}>
                    {session.pm2Connection ? (
                        <Stack fontSize={"0.9em"} paddingBlock={1} direction="column" spacing={1} alignItems="start" justifyContent="space-evenly">
                            <Chip
                                color={session.pm2Connection.isConnected ? "success" : "error"}
                                variant={session.pm2Connection.isConnected ? "outlined" : "filled"}
                                label="Type:"
                                component="div"
                                onDelete={() => { }}
                                deleteIcon={(
                                    <Tooltip title={session.pm2Connection.name} placement="right">
                                        {session.pm2Connection.name === "LOCAL_IPC" ? <Terminal /> : <Http />}
                                    </Tooltip>
                                )}
                            />
                            <Button isLoading={isDisconnecting} size="small" disabled={!session.pm2Connection.isConnected} color="error" onClick={disconnect} startIcon={<CancelPresentation />}>{UIText.disconnect}</Button>
                        </Stack>
                    ) : null}
                </Stack>
                <Box sx={{ flexGrow: 1 }} />
                <Box>
                    {UIText.readonlyMode}
                    <Switch
                        color="success"
                        checked={session.readonlyMode}
                        onClick={() => {
                            session.readonlyMode = !session.readonlyMode;
                            session.refreshUI();
                        }}
                    />
                </Box>
            </Toolbar>
        </AppBar>
    );
}