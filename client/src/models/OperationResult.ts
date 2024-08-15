import type { OperationResultType, OperationResultWithDataType } from "../../../common/types/OperationResult";

export class OperationResult implements OperationResultType {
    ok = false;
    message = "";

    succeeded(message = "Operation succeeded") {
        this.ok = true;
        if (message)
            this.message = message;
        return this;
    }

    failed(message = "Operation failed") {
        this.ok = false;
        if (message)
            this.message = message;
        return this;
    }
}

export class OperationResultWithData<T> extends OperationResult implements OperationResultWithDataType<T> {
    data: T | null = null;

    setData(data: OperationResultWithDataType<T>['data']) {
        this.data = data;
        return this;
    }
}
