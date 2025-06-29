import { ImportReceiverKeyPrefix } from "$lib/constants";
import type { IReceiverBilling } from "$lib/pdf/invoice-types";
import { ImportSupplierKeyPrefix } from "$lib/stores/supplier.svelte";
import { saveToLocalStorage } from "$lib/stores/utils/utils.svelte";

import { defaultReceiver } from "../receiver.svelte";
import { getFromStorage, getKeysFromStorage } from "./get-from-storage";

export function getReceiverKeysFromStorage() {
    return getKeysFromStorage(ImportSupplierKeyPrefix);
}

export function getReceiversFromStorage(
    search?: string,
): [string, IReceiverBilling][] {
    return getFromStorage<IReceiverBilling>(ImportSupplierKeyPrefix, search);
}

export function createReceiverInLocalStorage(
    key: string,
    value?: IReceiverBilling,
) {
    saveToLocalStorage(ImportReceiverKeyPrefix + key, value || defaultReceiver);
}
