export default class LocalStorageHelper<T extends Object> {
    private static itemKey = "csc_v2";

    private defaultData: T;

    private _data: T;
    public get data(): T {
        return this._data;
    }

    constructor(defaultData: T) {
        this.defaultData = JSON.parse(JSON.stringify(defaultData));
        const data = this.read();
        if (!data) {
            this.write(defaultData);
            this._data = defaultData;
        } else {
            this._data = data;
        }
    }

    private read(): T | null {
        try {
            const stringifiedData = localStorage.getItem(LocalStorageHelper.itemKey);
            const data = JSON.parse(stringifiedData ?? "");
            this._data = { ...data };
            return data;
        } catch {
            return null;
        }
    }

    write(data: T) {
        localStorage.setItem(LocalStorageHelper.itemKey, JSON.stringify(data));
        this._data = data;
    }

    rewrite() {
        localStorage.setItem(LocalStorageHelper.itemKey, JSON.stringify(this._data));
    }

    reset() {
        this.write(JSON.parse(JSON.stringify(this.defaultData)));
    }
}