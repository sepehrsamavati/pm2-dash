import type { UserViewModel } from "../../../../common/types/user";
import type { IPM2TargetProcess } from "../../../../common/types/dto";

export type Pm2ProcessOperation = IPM2TargetProcess & {
    user: UserViewModel;
};