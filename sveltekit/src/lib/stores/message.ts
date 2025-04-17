import { useLocalStorageContext } from "./sharedStore.svelte";

const defaultMessage = {
    closed: false,
};

export function useMessageStore({
    initialValue,
    key,
}: {
    initialValue?: typeof defaultMessage;
    key?: string;
} = {}) {
    return useLocalStorageContext(
        "messages-" + (key || ""),
        defaultMessage,
        initialValue,
    );
}
