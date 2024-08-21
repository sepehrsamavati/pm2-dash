import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../core/Session";
import constants from "../../core/config/constants";
import hasAccess from "../../core/helpers/roleHelper";
import menuLinks, { type MenuLink } from "../../core/menuLinks";
import { ChevronLeft as ChevronLeftIcon, ExpandLess, ExpandMore } from "@mui/icons-material";
import { CSSObject, Divider, Drawer as MuiDrawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Theme, styled, IconButton, Collapse } from "@mui/material";

export const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    minHeight: `${constants.style.drawerHeaderMinHeight}px !important`
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        backgroundColor: "red",
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

function LinkItem(props: {
    index: number;
    level: number;
    onClick?: () => void;
    isCollapsed?: boolean;
    closeCallback?: Function;
} & Omit<MenuLink, 'roles'>) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    return (
        <ListItem component="div" key={props.index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => {
                if (props.path) {
                    navigate(props.path);
                    if (props?.closeCallback)
                        props.closeCallback();
                } else {
                    setOpen(prevState => !prevState);
                }
                if (props?.onClick)
                    props.onClick();
            }}
                sx={{
                    minHeight: 48,
                    textAlign: 'start',
                    justifyContent: props.isCollapsed ? 'initial' : 'center',
                    paddingInlineStart: 2.5 + (0.8 * props.level),
                    paddingInlineEnd: 2.5
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        marginInlineEnd: props.isCollapsed ? 3 : 'auto',
                        justifyContent: 'center',
                    }}
                ><props.icon /></ListItemIcon>
                <ListItemText primary={props.title} sx={{ opacity: props.isCollapsed ? 1 : 0 }} />
                {props.subLinks && props.isCollapsed ? (
                    open ? <ExpandLess /> : <ExpandMore />
                ) : null}
            </ListItemButton>
            {props.subLinks ? (
                <Collapse in={open} timeout="auto">
                    <List component="div" disablePadding>
                        {/* {props.subLinks
                            .filter(link => hasAccess({ user: session.user?.role, page: link.roles, disableAuto: true }))
                            .map((link, index) => <LinkItem key={index} level={props.level + 1} closeCallback={props.closeCallback} isCollapsed={props.isCollapsed} {...link} index={index} />)} */}
                    </List>
                </Collapse>
            ) : null}
        </ListItem>
    );
}

export default function SideMenu(props: {
    isOpen?: boolean;
    closeCallback?: Function;
}) {
    const session = useSession();
    return (
        <Drawer anchor="left" variant="permanent" open={props.isOpen}>
            <DrawerHeader>
                <IconButton onClick={() => props?.closeCallback && props.closeCallback()}>
                    <ChevronLeftIcon />
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List disablePadding component="nav">

                {menuLinks
                    .filter(link => hasAccess({ user: session.user?.type, page: link.roles, disableAuto: true }))
                    .map((link, index) => <LinkItem key={index} level={0} {...link} closeCallback={props?.closeCallback} isCollapsed={props.isOpen} index={index} />)}
            </List>
        </Drawer>
    );
}