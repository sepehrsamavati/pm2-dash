import Header from "./Header";
import { Outlet } from "react-router-dom";
import { useSession } from "../../core/Session";
import { Container, CssBaseline } from "@mui/material";

export default function MainLayout() {
    const session = useSession();

    return (
        <>
            <CssBaseline />
            <Container
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: 'flex',
                    flexDirection: 'column',
                    '& > main': {
                        flexGrow: 1,
                        overflowY: "auto"
                    }
                }}
                maxWidth={false}
                disableGutters
            >
                {session.pm2Connection ? <Header /> : null}
                <main>
                    <Outlet />
                </main>
            </Container>
        </>
    );
}