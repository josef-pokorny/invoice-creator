import _ from "lodash";

import type { ISupplierBilling } from "$lib/pdf/invoice-types";
import {
    defaultSupplier,
    ImportSupplierKeyPrefix,
} from "$lib/stores/supplier.svelte";
import { saveToLocalStorage } from "$lib/stores/utils/utils.svelte";
import { normalizeStringForSearch } from "$lib/utils";

export function getSupplierKeysFromStorage() {
    return Object.entries(localStorage)
        .filter(([k]) => k.startsWith(ImportSupplierKeyPrefix))
        .map(([k]) => k.substring(ImportSupplierKeyPrefix.length))
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

export function getSuppliersFromStorage(
    search?: string,
): [string, ISupplierBilling][] {
    return Object.entries(localStorage)
        .filter(
            ([k]) =>
                k.startsWith(ImportSupplierKeyPrefix) &&
                !_.isEmpty(k.substring(ImportSupplierKeyPrefix.length)) &&
                (search?.length
                    ? normalizeStringForSearch(
                          k.substring(ImportSupplierKeyPrefix.length),
                      ).includes(search)
                    : true),
        )
        .sort(([a], [b]) =>
            a.localeCompare(b, undefined, { sensitivity: "base" }),
        )
        .map(([k, v]) => [k, JSON.parse(v)]);
}

export function createSupplierInLocalStorage(
    key: string,
    value?: ISupplierBilling,
) {
    saveToLocalStorage(ImportSupplierKeyPrefix + key, value || defaultSupplier);
}
