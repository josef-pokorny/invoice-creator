import { type ClassValue, clsx } from "clsx";
import _ from "lodash";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function createId(prefix: string = "input_") {
    return (
        _.uniqueId(prefix) + String(Math.round(Math.random() * 999999999999))
    );
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
