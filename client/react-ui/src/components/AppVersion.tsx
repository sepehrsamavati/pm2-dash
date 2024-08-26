import { Typography } from "@mui/material";
import { useSession } from "../core/Session";
import constants from "../core/config/constants";

export default function AppVersion(props?: {
    nameLabel?: boolean;
}) {
    const session = useSession();

    return (
        <Typography fontFamily="monospace" fontSize="inherit" textAlign="center" sx={{ direction: 'rtl' }}>{props?.nameLabel ? `${constants.appTitle} ` : ''}v{session.clientVersion}</Typography>
    );
}