import { getContext, hasContext, setContext } from "svelte";

// context for any type of signal/store
export const useSharedStore = <T>(name: string, createStore: () => T): T => {
    if (hasContext(name)) {
        return getContext<T>(name);
    }
    const store = createStore();
    setContext(name, store);
    return store;
};

// writable signal context
export const useWritable = <T, A>(
    name: string,
    initialValue: A,
    customStoreFactory: (value: A) => T,
): T => {
    return useSharedStore(name, () => customStoreFactory(initialValue));
};
