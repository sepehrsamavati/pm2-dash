import { useCallback, useState } from "react";
import { CancelPresentation, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../core/Session";
import constants from "../../core/config/constants";
import { AppBar as MuiAppBar, Toolbar, Typography, AppBarProps as MuiAppBarProps, styled, Box, IconButton, Stack } from "@mui/material";
import UIText from "../../core/i18n/UIText";
import Button from "../Button";

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
                    <Typography variant="h6" noWrap component="div">{constants.appTitle}</Typography>
                    {session.pm2Connection ? (
                        <Box>
                            {session.pm2Connection.name}
                            <Button isLoading={isDisconnecting} size="small" disabled={!session.pm2Connection.isConnected} color="error" onClick={disconnect} startIcon={<CancelPresentation />}>{UIText.disconnect}</Button>
                        </Box>
                    ) : null}
                </Stack>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton color="error" onClick={() => window.electronAPI.closeApp()}>
                    <Close />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}