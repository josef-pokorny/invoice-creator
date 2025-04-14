import { browser } from "$app/environment";
import { getContext, hasContext, setContext } from "svelte";
import _ from "lodash";

export interface TLocalStorageState<T> {
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
}): TLocalStorageState<T> {
    // Load initial value from localStorage if available

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

    // Create a state container with the initial value
    const store = $state({
        value: initialValue,
    });

    // Set up effect to save to localStorage when the state changes
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

    // Add reset function
    const reset = () => {
        if (defaultValue) {
            store.value = _.cloneDeep(defaultValue);
        } else {
            console.error(
                "defaultValue isn't provided, reset() function has not been completed",
            );
        }
    };

    // Return the enhanced state object
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

export function useLocalStorageContext<T extends Record<string, unknown>>(
    key: string,
    defaultValue: T,
    initialValue?: T,
): TLocalStorageState<T> {
    // Use provided localStorage key or fall back to context key
    const storageKey = `invoice-app-${key}`;

    // Check if we already have this store in context
    if (hasContext(key)) {
        return getContext<TLocalStorageState<T>>(key);
    }

    // If not in context, create it and set it in context
    const store = localStorageState({
        value: initialValue || defaultValue,
        key: storageKey,
        defaultValue: defaultValue,
    });

    // Save it in context so it can be reused
    setContext(key, store);

    return store;
}
