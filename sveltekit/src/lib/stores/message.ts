import { useLocalStorageStore } from "./sharedStore.svelte";

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
    return useLocalStorageStore({
        key: "messages-" + (key || ""),
        defaultValue: defaultMessage,
        initialValue,
    });
}
