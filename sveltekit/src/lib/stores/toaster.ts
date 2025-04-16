import { createToaster } from "@skeletonlabs/skeleton-svelte";
import { useStoreContext } from "./sharedStore.svelte";

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
    return useStoreContext(
        "toaster-" + (key || ""),
        defaultToaster,
        initialValue,
    );
}
