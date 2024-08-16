export type OperationResultType = {
    ok: boolean;
    message: string;
}

export type OperationResultWithDataType<T> = OperationResultType & {
    data: T | null;
};