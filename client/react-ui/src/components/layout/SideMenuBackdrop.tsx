import { Box } from "@mui/material";

export default function SideMenuBackdrop(props?: {
    visible?: boolean;
    closeMenu?: Function;
}) {
    return (
        <Box
            onClick={() => props?.closeMenu && props.closeMenu()}
            sx={{
                display: props?.visible ? "block" : "none",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 100,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.3)",
                backdropFilter: "blur(2px)"
            }}
        />
    );
}