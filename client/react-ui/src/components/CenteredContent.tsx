import React from "react";
import { Container } from "@mui/material";

export default function CenteredContent(props?: {
    children?: React.ReactNode;
}) {
    return (
        <Container
            maxWidth={false}
            disableGutters
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "fixed",
                left: 0,
                top: 0,
            }}
        >{props?.children}</Container>
    );
}