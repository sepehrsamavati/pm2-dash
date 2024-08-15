import { Typography } from "@mui/material";
import constants from "../core/config/constants";

export default function AppVersion(props?: {
    nameLabel?: boolean;
}) {
    return (
        <Typography fontFamily="monospace" fontSize="inherit" textAlign="center" sx={{ direction: 'rtl' }}>{props?.nameLabel ? `${constants.appTitle} ` : ''}v{constants.appVersion}</Typography>
    );
}