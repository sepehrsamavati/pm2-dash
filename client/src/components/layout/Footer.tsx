import AppVersion from "../AppVersion";
import { Container, Grid } from "@mui/material";

export default function Footer() {
    return (
        <Container
            disableGutters
            maxWidth={false}
            component="footer"
            sx={{
                pt: 1,
                paddingInlineStart: 12,
                paddingInlineEnd: 6,
                fontSize: "0.8em",
                borderTop: "2px solid currentColor",
                boxShadow: "0 0 1em rgba(0, 0, 0, 0.52)"
            }}
        >
            <Grid container alignItems="center" justifyContent="flex-end">
                <Grid item sx={{ writingMode: "vertical-lr", rotate: "180deg" }}><AppVersion /></Grid>
            </Grid>
        </Container>
    );
}