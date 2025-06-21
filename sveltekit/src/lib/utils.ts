import _ from "lodash";
import { v4 as uuid } from "uuid";

export function createId(prefix: string = "input_") {
    return _.uniqueId(prefix) + uuid();
}

export function countDecimals(value: number) {
    if (Math.floor(value) === value) return 0;

    const str = Math.abs(value).toString();

    if (str.indexOf(".") !== -1 && str.indexOf("-") !== -1) {
        return parseInt(str.split("-")[1] || "0", 10);
    } else if (str.indexOf(".") !== -1) {
        return str.split(".")[1].length || 0;
    }

    return parseInt(str.split("-")[1] || "0", 10);
}

export function getNestedKeys(obj: Record<string, any>, prefix = ""): string[] {
    const keys: string[] = [];

    for (const key in obj) {
        const value = obj[key];
        const path = prefix ? `${prefix}.${key}` : key;

        if (_.isPlainObject(value)) {
            keys.push(path);
            keys.push(...getNestedKeys(value, path));
        } else {
            keys.push(path);
        }
    }

    return keys;
}

export function normalizeStringForSearch(str: string) {
    return _.toLower(str.replace(/\s/g, ""))
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}
