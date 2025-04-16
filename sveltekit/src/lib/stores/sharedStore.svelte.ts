import { browser } from "$app/environment";
import { getContext, hasContext, setContext } from "svelte";
import _ from "lodash";

export interface TSharedStorageState<T> {
    value: T;
    reset: () => void;
}

const UndefinedReplacement = "undefinened#6Wundefinened";

export function localStorageState<T>({
    value,
    key,
    defaultValue,
}: {
    value: T;
    key: string;
    defaultValue?: T;
}): TSharedStorageState<T> {
    let initialValue = value;
    if (browser) {
        const storedValue = localStorage.getItem(key);
        if (storedValue !== null) {
            try {
                let parsedData = JSON.parse(storedValue, (k, v) =>
                    v === UndefinedReplacement ? undefined : v,
                ) as T;

                const differentKeys =
                    defaultValue && parsedData
                        ? _.difference(
                              Object.keys(defaultValue),
                              Object.keys(parsedData),
                          )
                        : [];

                if (!parsedData && defaultValue) {
                    initialValue = defaultValue;
                } else if (parsedData && differentKeys.length > 0) {
                    differentKeys.forEach((key) => {
                        parsedData = _.set(
                            parsedData as NonNullable<T>,
                            key,
                            _.get(defaultValue, key),
                        );
                    });

                    initialValue = parsedData;
                } else {
                    initialValue = parsedData;
                }
            } catch (error) {
                console.error(
                    `Failed to parse localStorage key "${key}":`,
                    error,
                );
            }
        }
    }

    const store = $state({
        value: initialValue,
    });

    $effect(() => {
        if (browser) {
            localStorage.setItem(
                key,
                JSON.stringify(store.value, (k, v) =>
                    v === undefined ? UndefinedReplacement : v,
                ),
            );
        }
    });

    const reset = () => {
        if (defaultValue) {
            store.value = _.cloneDeep(defaultValue);
        } else {
            console.error(
                "defaultValue isn't provided, reset() function has not been completed",
            );
        }
    };

    return {
        get value() {
            return store.value;
        },
        set value(newValue) {
            store.value = newValue;
        },
        reset,
    };
}

export function useLocalStorageContext<T>(
    key: string,
    defaultValue: T,
    initialValue?: T,
): TSharedStorageState<T> {
    const storageKey = `invoice-app-${key}`;

    if (hasContext(key)) {
        return getContext<TSharedStorageState<T>>(key);
    }

    const store = localStorageState({
        value: initialValue || defaultValue,
        key: storageKey,
        defaultValue: defaultValue,
    });

    setContext(key, store);

    return store;
}

export function storeState<T>({
    defaultValue,
    initialValue,
}: {
    defaultValue: T;
    initialValue?: T;
}): TSharedStorageState<T> {
    const store = $state({
        value: initialValue || defaultValue,
    });

    const reset = () => {
        if (defaultValue) {
            store.value = _.cloneDeep(defaultValue);
        } else {
            console.error(
                "defaultValue isn't provided, reset() function has not been completed",
            );
        }
    };

    return {
        get value() {
            return store.value;
        },
        set value(newValue) {
            store.value = newValue;
        },
        reset,
    };
}

export function useStoreContext<T>(
    key: string,
    defaultValue: T,
    initialValue?: T,
): TSharedStorageState<T> {
    if (hasContext(key)) {
        return getContext<TSharedStorageState<T>>(key);
    }

    const store = storeState({ defaultValue, initialValue });

    setContext(key, store);

    return store;
}
