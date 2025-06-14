import { createToaster } from "@skeletonlabs/skeleton-svelte";

import { useStore } from "./sharedStore.svelte";

const defaultToaster: ReturnType<typeof createToaster> = createToaster({
    placement: "bottom-end",
});

export function useToasterStore({
    initialValue,
    key,
}: {
    initialValue?: typeof defaultToaster;
    key?: string;
} = {}) {
    return useStore("toaster-" + (key || ""), defaultToaster, initialValue);
}
