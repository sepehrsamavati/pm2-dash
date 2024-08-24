import Header from "./Header";
import RoleHOC from "../RoleHOC";
import SideMenu from "./SideMenu";
import { Outlet } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { useSession } from "../../core/Session";
import { AccountType } from "../../types/enums";
import SideMenuBackdrop from "./SideMenuBackdrop";
import { Container, CssBaseline } from "@mui/material";

export default function MainLayout() {
    const session = useSession();
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    const openMenuRequestHandler = useCallback(() => setMenuIsOpen(true), []);
    const closeMenuRequestHandler = useCallback(() => setMenuIsOpen(false), []);

    useEffect(() => {
        if (session.user?.type !== AccountType.Admin) {
            setMenuIsOpen(false);
        }
    }, [session.user?.type]);

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
                {session.pm2Connection ? <Header menuIsOpen={menuIsOpen} openMenuRequest={openMenuRequestHandler} /> : null}
                <main>
                    {session.pm2Connection?.name === "HTTP_SERVER" ? (
                        <RoleHOC roles={AccountType.Admin}>
                            <SideMenu isOpen={menuIsOpen} closeCallback={closeMenuRequestHandler} />
                            <SideMenuBackdrop visible={menuIsOpen} closeMenu={closeMenuRequestHandler} />
                        </RoleHOC>
                    ) : null}
                    <Outlet />
                </main>
            </Container>
        </>
    );
}