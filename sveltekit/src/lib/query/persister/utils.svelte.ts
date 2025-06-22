// Copied from https://github.com/TanStack/query/blob/svelte-5-adapter/packages/svelte-query-persist-client/src/PersistQueryClientProvider.svelte

type Box<T> = { current: T };

export function box<T>(initial: T): Box<T> {
    let current = $state(initial);

    return {
        get current() {
            return current;
        },
        set current(newValue) {
            current = newValue;
        },
    };
}
