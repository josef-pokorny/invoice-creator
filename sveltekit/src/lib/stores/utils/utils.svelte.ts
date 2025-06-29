import _ from "lodash";

import { browser } from "$app/environment";
import { getNestedKeys } from "$lib/utils";

export interface TStoreState<T> {
    value: T;
    reset: () => void;
    setKey: (setNewKey: string) => void;
    deleteStore: () => void;
    key: string;
}

export const stores = $state({
    value: new Map<string, TStoreState<unknown>>(),
});
export const UndefinedReplacement = "undefinened#6Wundefinened";

export function saveToLocalStorage<T>(
    localStorageKey: string,
    value: NonNullable<T>,
) {
    localStorage.setItem(
        localStorageKey,
        JSON.stringify(value, (k, v) =>
            v === undefined ? UndefinedReplacement : v,
        ),
    );
}

export function getStoreValueFromLocalStorage<T>({
    key,
    defaultValue,
}: {
    key: string;
    defaultValue?: T;
}) {
    if (browser) {
        const storedValue = localStorage.getItem(key);

        if (storedValue !== null) {
            try {
                let parsedData = JSON.parse(storedValue, (k, v) =>
                    v === UndefinedReplacement ? undefined : v,
                ) as T;

                const differentKeys =
                    defaultValue && parsedData
                        ? _.xor(
                              getNestedKeys(parsedData),
                              getNestedKeys(defaultValue),
                          )
                        : [];

                if (!parsedData && defaultValue) {
                    return _.cloneDeep(defaultValue);
                } else if (parsedData && differentKeys.length > 0) {
                    differentKeys.forEach((differentKey) => {
                        const valueFromDefault = _.get(
                            defaultValue,
                            differentKey,
                        );

                        if (!_.isUndefined(valueFromDefault)) {
                            parsedData = _.set(
                                parsedData as NonNullable<T>,
                                differentKey,
                                valueFromDefault,
                            );
                        }
                    });

                    return parsedData;
                } else {
                    return parsedData;
                }
            } catch (error) {
                console.error(
                    `Failed to parse localStorage key "${key}":`,
                    error,
                );
            }
        }
    }
}

export function deleteStore(key: string) {
    if (browser) {
        stores.value.delete(key);
        localStorage.removeItem(key);
    }
}

export function setKey(prevKey: string, newKey: string) {
    if (
        stores.value.get(newKey) ||
        getStoreValueFromLocalStorage({ key: newKey })
    ) {
        throw Error(`There is already a store with key ${newKey}`);
    } else {
        const prevStore = stores.value.get(prevKey);
        if (prevStore) stores.value.set(newKey, prevStore);

        const prevValue = getStoreValueFromLocalStorage({ key: prevKey });
        if (prevValue) saveToLocalStorage(newKey, prevValue);

        deleteStore(prevKey);
    }
}
