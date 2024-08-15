import { Close } from "@mui/icons-material";
import { useSession } from "../../core/Session";
import constants from "../../core/config/constants";
import { AppBar as MuiAppBar, Toolbar, Typography, AppBarProps as MuiAppBarProps, styled, Box, IconButton, Stack } from "@mui/material";

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
    return (
        <AppBar position="fixed">
            <Toolbar>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h6" noWrap component="div">{constants.appTitle}</Typography>
                    {session.pm2Connection ? (
                        <Box>
                            {session.pm2Connection.name}
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