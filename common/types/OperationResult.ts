import type { UITextKeyOptional } from "./UIText";

export type OperationResultType = {
    ok: boolean;
    message: UITextKeyOptional;
}

export type OperationResultWithDataType<T> = OperationResultType & {
    data: T | null;
};