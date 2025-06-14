import _ from "lodash";

import { browser } from "$app/environment";
import { AppStoragePrefix } from "$lib/constants";
import { saveToLocalStorage, UndefinedReplacement } from "$lib/stores/utils";
import { getNestedKeys } from "$lib/utils";

export const stores = $state({
    value: new Map<string, TSharedStorageState<unknown>>(),
});
const storesWithEffectForSetToLocalStorage: Record<string, boolean> = $state(
    {},
);

export interface TSharedStorageState<T> {
    value: T;
    reset: () => void;
    deleteStore: () => void;
}

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
                        ? _.difference(
                              getNestedKeys(defaultValue),
                              getNestedKeys(parsedData),
                          )
                        : [];

                if (!parsedData && defaultValue) {
                    value = _.cloneDeep(defaultValue);
                } else if (parsedData && differentKeys.length > 0) {
                    differentKeys.forEach((key) => {
                        parsedData = _.set(
                            parsedData as NonNullable<T>,
                            key,
                            _.get(defaultValue, key),
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
            value = _.cloneDeep(defaultValue);
        } else {
            console.error(
                "defaultValue isn't provided, reset() function has not been completed",
            );
        }
    }

    function deleteStore() {
        if (browser) {
            localStorage.removeItem(key);
            stores.value.delete(key);
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
                        ? _.difference(
                              Object.keys(defaultValue),
                              Object.keys(newValue),
                          )
                        : [];

                if (differentKeys.length) {
                    differentKeys.forEach((storageKey) => {
                        newValue = _.set(
                            newValue as NonNullable<T>,
                            storageKey,
                            _.get(defaultValue, storageKey),
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

    if (stores.value.has(localStorageKey)) {
        store = stores.value.get(localStorageKey) as any;
    } else {
        stores.value.set(
            localStorageKey,
            createLocalStorageStore({
                key: localStorageKey,
                defaultValue,
                initialValue,
            }),
        );
        store = stores.value.get(localStorageKey) as any;
    }

    $effect.root(() => {
        if (storesWithEffectForSetToLocalStorage[localStorageKey] || !browser)
            return;

        storesWithEffectForSetToLocalStorage[localStorageKey] = true;

        $effect(() => {
            saveToLocalStorage(localStorageKey, store.value);
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
            value = _.cloneDeep(defaultValue);
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

    if (stores.value.has(storeKey)) {
        return stores.value.get(storeKey) as any;
    } else {
        stores.value.set(
            storeKey,
            createStore({
                defaultValue,
                initialValue,
            }) as any,
        );
        return stores.value.get(storeKey) as any;
    }
}

export function deleteStore(key: string) {
    if (!stores.value.get(key)?.deleteStore()) {
        localStorage.removeItem(key);
    }
}
