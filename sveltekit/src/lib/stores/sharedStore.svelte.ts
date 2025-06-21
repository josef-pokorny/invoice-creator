import _ from "lodash";

import { browser } from "$app/environment";
import { AppStoragePrefix } from "$lib/constants";
import {
    deleteStore,
    getStoreValueFromLocalStorage,
    saveToLocalStorage,
    setKey,
    stores,
    type TSharedStorageState,
} from "$lib/stores/utils/utils.svelte";
import { getNestedKeys } from "$lib/utils";

const storesWithEffectForSetToLocalStorage: Record<string, boolean> = $state(
    {},
);

function createLocalStorageStore<T>({
    key,
    defaultValue,
    initialValue,
}: {
    key: string;
    defaultValue: T;
    initialValue?: T;
}): TSharedStorageState<T> {
    let value = $state(initialValue || defaultValue);

    const valueFromStore = getStoreValueFromLocalStorage({
        key,
        defaultValue,
    });
    if (valueFromStore) value = valueFromStore;

    function reset() {
        if (defaultValue) {
            value = _.cloneDeep(defaultValue);
        } else {
            console.error(
                "defaultValue isn't provided, reset() function has not been completed",
            );
        }
    }

    function deleteStoreInner() {
        deleteStore(key);
    }

    function setKeyInner(newKey: string) {
        setKey(key, newKey);
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
                              getNestedKeys(defaultValue),
                              getNestedKeys(newValue),
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
        deleteStore: deleteStoreInner,
        setKey: setKeyInner,
        key,
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
        store = stores.value.get(localStorageKey) as TSharedStorageState<T>;
    } else {
        stores.value.set(
            localStorageKey,
            createLocalStorageStore({
                key: localStorageKey,
                defaultValue,
                initialValue,
            }),
        );
        store = stores.value.get(localStorageKey) as TSharedStorageState<T>;
    }

    $effect.root(() => {
        if (storesWithEffectForSetToLocalStorage[localStorageKey] || !browser)
            return;

        storesWithEffectForSetToLocalStorage[localStorageKey] = true;

        $effect(() => {
            if (store.value) {
                saveToLocalStorage(localStorageKey, store.value);
            }
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
        return stores.value.get(storeKey) as TSharedStorageState<T>;
    } else {
        stores.value.set(
            storeKey,
            createStore({
                defaultValue,
                initialValue,
            }) as any,
        );
        return stores.value.get(storeKey) as TSharedStorageState<T>;
    }
}
