import { browser } from "$app/environment";
import _ from "lodash";

export const AppStoragePrefix = "invoice-app-";

const stores = $state(new Map<string, any>());

export interface TSharedStorageState<T> {
    value: T;
    reset: () => void;
}

const UndefinedReplacement = "undefinened#6Wundefinened";

export function useLocalStorageContext<T>({
    key,
    defaultValue,
    initialValue,
}: {
    key: string;
    defaultValue: T;
    initialValue?: T;
}): TSharedStorageState<T> {
    const storageKey = AppStoragePrefix + key;

    let value = $state(initialValue || defaultValue);

    if (stores.has(storageKey)) {
        value = stores.get(storageKey) as any;
    } else if (browser) {
        const storedValue = localStorage.getItem(storageKey);

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
                    value = defaultValue;
                } else if (parsedData && differentKeys.length > 0) {
                    differentKeys.forEach((storageKey) => {
                        parsedData = _.set(
                            parsedData as NonNullable<T>,
                            storageKey,
                            _.get(defaultValue, storageKey),
                        );
                    });

                    value = parsedData;
                } else {
                    value = parsedData;
                }
            } catch (error) {
                console.error(
                    `Failed to parse localStorage key "${storageKey}":`,
                    error,
                );
            }
        }

        stores.set(storageKey, value);
    }

    $effect(() => {
        if (browser) {
            localStorage.setItem(
                storageKey,
                JSON.stringify(value, (k, v) =>
                    v === undefined ? UndefinedReplacement : v,
                ),
            );
        }
    });

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

export function useStoreContext<T>(
    key: string,
    defaultValue: T,
    initialValue?: T,
): TSharedStorageState<T> {
    const storageKeyStore = AppStoragePrefix + key;

    let value = $state(initialValue || defaultValue);

    if (stores.has(storageKeyStore)) {
        value = stores.get(storageKeyStore) as any;
    } else {
        stores.set(storageKeyStore, value);
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
        },
        reset,
    };
}
