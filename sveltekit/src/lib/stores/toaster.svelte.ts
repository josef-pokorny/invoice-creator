import { Toaster } from "melt/builders";
import type { Snippet } from "svelte";

import { useStore } from "./sharedStore.svelte";

export type ToastData = {
    title?: Snippet | string;
    description?: Snippet | string;
    variant?: "success" | "warning" | "error";
};

export function useToasterStore({
    initialValue,
    key,
}: {
    initialValue?: Toaster<ToastData>;
    key?: string;
} = {}) {
    return useStore("toaster-" + (key || ""), initialValue);
}
