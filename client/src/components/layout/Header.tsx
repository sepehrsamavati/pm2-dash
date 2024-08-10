import constants from "../../core/config/constants";
import { AppBar as MuiAppBar, Toolbar, Typography, AppBarProps as MuiAppBarProps, styled, Box } from "@mui/material";

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
    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h6" noWrap component="div">{constants.appTitle}</Typography>
                <Box sx={{ flexGrow: 1 }} />
            </Toolbar>
        </AppBar>
    );
}