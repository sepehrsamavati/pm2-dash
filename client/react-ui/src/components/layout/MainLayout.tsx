import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { Container, CssBaseline } from "@mui/material";

export default function MainLayout() {
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
                <Header />
                <main>
                    <Outlet />
                </main>
                <Footer />
            </Container>
        </>
    );
}