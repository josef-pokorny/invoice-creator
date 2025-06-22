import type { IInvoiceValues } from "$lib/pdf/invoice-types";
import type { NestedKeyOf, YupErrorsList } from "$lib/types/types";

import { useFormErrorsStore } from "../form.svelte";

const formErrorsStore = useFormErrorsStore();

export function addFormError(
    path: NestedKeyOf<YupErrorsList<IInvoiceValues>>,
    error: string,
) {
    formErrorsStore.value[path] = {
        messages: [...(formErrorsStore.value[path]?.messages || []), error],
    };
}
