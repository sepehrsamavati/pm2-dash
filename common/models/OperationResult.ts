import type { UITextKeyOptional } from "../types/UIText";
import type { OperationResultType, OperationResultWithDataType } from "../types/OperationResult";

export class OperationResult implements OperationResultType {
    ok = false;
    message = "";

    succeeded(message: UITextKeyOptional) {
        this.ok = true;
        if (message)
            this.message = message;
        return this;
    }

    failed(message: UITextKeyOptional) {
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
