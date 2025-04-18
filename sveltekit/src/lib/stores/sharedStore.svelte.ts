import { browser } from "$app/environment";
import _ from "lodash";

export const AppStoragePrefix = "invoice-app-";

const stores = $state(new Map<string, any>());
const storesWithEffectForSetToLocalStorage: Record<string, boolean> = $state(
    {},
);

export interface TSharedStorageState<T> {
    value: T;
    reset: () => void;
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
                        ? _.difference(
                              Object.keys(defaultValue),
                              Object.keys(parsedData),
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
