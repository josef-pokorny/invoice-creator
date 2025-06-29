import type { ISupplierBilling } from "$lib/pdf/invoice-types";
import {
    defaultSupplier,
    ImportSupplierKeyPrefix,
} from "$lib/stores/supplier.svelte";
import { saveToLocalStorage } from "$lib/stores/utils/utils.svelte";

import { getFromStorage, getKeysFromStorage } from "./get-from-storage";

export function getSupplierKeysFromStorage() {
    return getKeysFromStorage(ImportSupplierKeyPrefix);
}

export function getSuppliersFromStorage(
    search?: string,
): [string, ISupplierBilling][] {
    return getFromStorage<ISupplierBilling>(ImportSupplierKeyPrefix, search);
}

export function createSupplierInLocalStorage(
    key: string,
    value?: ISupplierBilling,
) {
    saveToLocalStorage(ImportSupplierKeyPrefix + key, value || defaultSupplier);
}
