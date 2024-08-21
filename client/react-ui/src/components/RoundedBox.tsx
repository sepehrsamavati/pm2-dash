import { Box } from "@mui/material";

export default function RoundedBox(props?: {
    children?: React.ReactNode;
}) {
    return (
        <Box sx={{ boxShadow: 3, borderRadius: 2, marginBlock: 2, padding: 1 }}>{props?.children}</Box>
    );
}