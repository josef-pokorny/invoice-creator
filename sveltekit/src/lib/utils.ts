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
