import * as yup from "yup";

export type YupShape<Fields extends Record<string, unknown>> = {
    [Key in keyof Fields]: yup.AnySchema<Fields[Key]>;
};

export type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType &
        (string | number)]: ObjectType[Key] extends ReadonlyArray<
        infer ItemType
    >
        ? ItemType extends object
            ? `${Key}` | `${Key}.${NestedKeyOf<ItemType>}`
            : `${Key}`
        : ObjectType[Key] extends object
          ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
          : `${Key}`;
}[keyof ObjectType & (string | number)];

export interface IYupError {
    messages?: string[];
}

export type YupErrorsList<T extends object> = {
    [K in NestedKeyOf<T>]?: IYupError;
};
