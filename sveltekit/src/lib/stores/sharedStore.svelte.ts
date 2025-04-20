import { browser } from "$app/environment";
import { cloneDeep, difference, get, set } from "lodash-es";

export const AppStoragePrefix = "invoice-app-";

const stores = $state(new Map<string, any>());
const storesWithEffectForSetToLocalStorage: Record<string, boolean> = $state(
    {},
);

export interface TSharedStorageState<T> {
    value: T;
    reset: () => void;
    deleteStore: () => void;
}

const UndefinedReplacement = "undefinened#6Wundefinened";

function createLocalStorageStore<T>({
    key,
    defaultValue,
    initialValue,
}: {
    key: string;
    defaultValue: T;
    initialValue?: T;
}) {
    let value = $state(initialValue || defaultValue);

    if (browser) {
        const storedValue = localStorage.getItem(key);

        if (storedValue !== null) {
            try {
                let parsedData = JSON.parse(storedValue, (k, v) =>
                    v === UndefinedReplacement ? undefined : v,
                ) as T;

                const differentKeys =
                    defaultValue && parsedData
                        ? difference(
                              Object.keys(defaultValue),
                              Object.keys(parsedData),
                          )
                        : [];

                if (!parsedData && defaultValue) {
                    value = cloneDeep(defaultValue);
                } else if (parsedData && differentKeys.length > 0) {
                    differentKeys.forEach((key) => {
                        parsedData = set(
                            parsedData as NonNullable<T>,
                            key,
                            get(defaultValue, key),
                        );
                    });

                    value = parsedData;
                } else {
                    value = parsedData;
                }
            } catch (error) {
                console.error(
                    `Failed to parse localStorage key "${key}":`,
                    error,
                );
            }
        }
    }

    function reset() {
        if (defaultValue) {
            value = cloneDeep(defaultValue);
        } else {
            console.error(
                "defaultValue isn't provided, reset() function has not been completed",
            );
        }
    }

    function deleteStore() {
        if (browser) {
            value = cloneDeep(defaultValue);
            localStorage.removeItem(key);
            stores.delete(key);
        }
    }

    return {
        get value() {
            return value;
        },
        set value(newValue) {
            value = newValue;

            setTimeout(() => {
                const differentKeys =
                    defaultValue && newValue
                        ? difference(
                              Object.keys(defaultValue),
                              Object.keys(newValue),
                          )
                        : [];

                if (differentKeys.length) {
                    differentKeys.forEach((storageKey) => {
                        newValue = set(
                            newValue as NonNullable<T>,
                            storageKey,
                            get(defaultValue, storageKey),
                        );
                    });

                    value = newValue;
                }
            }, 0);
        },
        reset,
        deleteStore,
    };
}

export function useLocalStorageStore<T>({
    key,
    defaultValue,
    initialValue,
}: {
    key: string;
    defaultValue: T;
    initialValue?: T;
}): TSharedStorageState<T> {
    const localStorageKey = AppStoragePrefix + key;

    let store: TSharedStorageState<T>;

    if (stores.has(localStorageKey)) {
        store = stores.get(localStorageKey);
    } else {
        stores.set(
            localStorageKey,
            createLocalStorageStore({
                key: localStorageKey,
                defaultValue,
                initialValue,
            }),
        );
        store = stores.get(localStorageKey);
    }

    $effect.root(() => {
        if (storesWithEffectForSetToLocalStorage[localStorageKey] || !browser)
            return;

        storesWithEffectForSetToLocalStorage[localStorageKey] = true;

        $effect(() => {
            localStorage.setItem(
                localStorageKey,
                JSON.stringify(store.value, (k, v) =>
                    v === undefined ? UndefinedReplacement : v,
                ),
            );
        });

        return () => {
            storesWithEffectForSetToLocalStorage[localStorageKey] = false;
        };
    });

    return store;
}

function createStore<T>({
    defaultValue,
    initialValue,
}: {
    defaultValue: T;
    initialValue?: T;
}) {
    let value = $state(initialValue || defaultValue);

    const reset = () => {
        if (defaultValue) {
            value = cloneDeep(defaultValue);
        } else {
            console.error(
                "defaultValue isn't provided, reset() function has not been completed",
            );
        }
    };

    return {
        get value() {
            return value;
        },
        set value(newValue) {
            value = newValue;
        },
        reset,
    };
}

export function useStore<T>(
    key: string,
    defaultValue: T,
    initialValue?: T,
): TSharedStorageState<T> {
    const storeKey = AppStoragePrefix + key;

    if (stores.has(storeKey)) {
        return stores.get(storeKey);
    } else {
        const store = createStore({
            defaultValue,
            initialValue,
        });
        stores.set(storeKey, store);
        return stores.get(storeKey);
    }
}
