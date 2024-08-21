import UIText from "../i18n/UIText";
import { Permission } from "@/common/types/enums";

export const getPermissionUIText = (permission: Permission) => (
    ({
        2: UIText.view,
        3: UIText.restart,
        4: UIText.stop,
        5: UIText.delete,
        6: UIText.flush,
        7: UIText.reset,
        8: UIText.viewOutputLog,
        9: UIText.viewErrorLog,
    })[permission]
);
