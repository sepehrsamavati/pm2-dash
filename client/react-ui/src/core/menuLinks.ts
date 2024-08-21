import UIText from "./i18n/UIText";
import { AccountType } from "../types/enums";
import type { FunctionComponent } from "react";
import { BarChart, SupervisedUserCircle } from "@mui/icons-material";

export type MenuLink = {
    icon: FunctionComponent;
    title: string;
    roles: AccountType[];
    path?: string;
    subLinks?: MenuLink[];
};

const links: MenuLink[] = [
    { title: UIText.dashboard, path: "/List", icon: BarChart, roles: [AccountType.Manager, AccountType.Member] },
    { title: UIText.users, path: "/Users/List", icon: SupervisedUserCircle, roles: [AccountType.Admin] },
];

export default links;
