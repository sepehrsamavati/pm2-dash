import UIText from "../core/i18n/UIText";
import { ContentPasteSearch } from "@mui/icons-material";
import { Container, Divider, Icon, Typography } from "@mui/material";

export default function DataGridWrapper(props?: {
    title?: string;
    reducePadding?: boolean;
    noBorder?: boolean;
    searchSection?: React.ReactNode;
    children?: React.ReactNode;
}) {
    return (
        <Container
            maxWidth={false}
            sx={{
                ...(props?.noBorder ? {
                    padding: "0 !important",
                } : {
                    boxShadow: 1,
                    border: 2,
                    borderStyle: "solid",
                    borderColor: "primary.dark",
                    borderRadius: 1,
                    padding: props?.reducePadding ? 1 : 4,
                }),
                '& .MuiDataGrid-root': {
                    boxShadow: 2,
                    border: 2,
                    borderColor: 'primary.light',
                    '& .MuiDataGrid-cell:hover': {
                        color: 'primary.main',
                    },
                }
            }}>
            {props?.title ? (
                <Typography
                    fontWeight="bold"
                    fontSize="1.2em"
                >{props.title}</Typography>
            ) : null}
            {props?.searchSection ? (
                <>
                    <Typography
                        fontWeight="bold"
                        fontSize="1.2em"
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        <Icon sx={{ marginInlineEnd: 1 }}><ContentPasteSearch /></Icon> {UIText.search}
                    </Typography>
                    <br />
                    {props.searchSection}
                    <Divider sx={{ marginInline: -3, marginBlock: 4 }} />
                </>
            ) : null}
            {props?.children}
        </Container>
    );
}