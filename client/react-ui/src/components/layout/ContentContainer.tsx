import type { ReactNode } from "react";
import { useSession } from "../../core/Session";
import { AccountType } from "../../types/enums";
import constants from "../../core/config/constants";
import { Container, Divider, Typography } from "@mui/material";

export default function ContentContainer(props?: {
    title?: string;
    children?: ReactNode;
}) {
    const session = useSession();
    return (
        <Container
            maxWidth={false}
            disableGutters={true}
            sx={{
                marginBlockStart: `${constants.style.contentContainerMarginTop}px`,
                paddingInline: 5,
                paddingInlineStart: session.user?.type === AccountType.Admin ? 12 : 5,
                overflowY: "auto",
                maxHeight: `calc(100% - ${constants.style.contentContainerMarginTop + 10}px)`
            }}
        >
            {props?.title ? (
                <>
                    <Typography component="h2" fontSize="1.7em">{props?.title}</Typography>
                    <Divider sx={{ marginBlock: 2 }} />
                </>
            ) : null}
            {props?.children}
        </Container>
    );
}