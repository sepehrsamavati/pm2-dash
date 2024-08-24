export const getEnumValues = <TEnum extends object>(_enum: TEnum): number[] => Object.keys(_enum).map((key) => _enum[key as keyof TEnum]).filter(v => typeof v === "number") as number[];

const getEnumOptions = <TEnum extends object>(_enum: TEnum, uitGetter: (_enum: TEnum[keyof TEnum]) => string, exclude?: unknown): [number, string][] => {
    const values = getEnumValues(_enum);
    return values.filter(v => exclude !== undefined ? v !== exclude : true).map(v => [v, uitGetter(v as TEnum[keyof TEnum])]);
};

export default getEnumOptions;