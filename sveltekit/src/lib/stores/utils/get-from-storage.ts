import _ from "lodash";

import { browser } from "$app/environment";
import { normalizeStringForSearch } from "$lib/utils";

export function getKeysFromStorage(keyPrefix: string, search?: string) {
    if (!browser) return [];

    const normalizedSearch = search ? normalizeStringForSearch(search) : null;

    return Object.entries(localStorage)
        .filter(
            ([k]) =>
                k.startsWith(keyPrefix) &&
                (normalizedSearch?.length
                    ? normalizeStringForSearch(
                          k.substring(keyPrefix.length),
                      ).includes(normalizedSearch)
                    : true),
        )
        .map(([k]) => k.substring(keyPrefix.length))
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

export function getFromStorage<O>(keyPrefix: string, search?: string) {
    if (!browser) return [];

    const normalizedSearch = search ? normalizeStringForSearch(search) : null;

    return Object.entries(localStorage)
        .filter(
            ([k]) =>
                k.startsWith(keyPrefix) &&
                !_.isEmpty(k.substring(keyPrefix.length)) &&
                (normalizedSearch?.length
                    ? normalizeStringForSearch(
                          k.substring(keyPrefix.length),
                      ).includes(normalizedSearch)
                    : true),
        )
        .sort(([a], [b]) =>
            a.localeCompare(b, undefined, { sensitivity: "base" }),
        )
        .map(
            ([k, v]) =>
                [k.substring(keyPrefix.length), JSON.parse(v)] as [string, O],
        );
}
