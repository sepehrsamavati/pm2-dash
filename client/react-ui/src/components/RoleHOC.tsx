import { useSession } from "../core/Session";
import { AccountType } from "@/common/types/enums";
import hasAccess from "../core/helpers/roleHelper";

export default function RoleHOC(props?: {
    roles?: AccountType | AccountType[];
    children?: React.ReactNode;
    disableAuto?: boolean;
}) {
    const session = useSession();

    return hasAccess({
        user: session.user?.type,
        page: props?.roles,
        disableAuto: props?.disableAuto
    }) ? <>{props?.children}</> : null;
}