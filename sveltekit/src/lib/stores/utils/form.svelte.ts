import { ImportInvoiceKeyPrefix } from "../form.svelte";
import { getKeysFromStorage } from "./get-from-storage";

export function getFormKeysFromStorage(search?: string) {
    return getKeysFromStorage(ImportInvoiceKeyPrefix, search);
}
