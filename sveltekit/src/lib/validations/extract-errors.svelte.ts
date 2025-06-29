import * as yup from "yup";

import type { NestedKeyOf, YupErrorsList } from "$lib/types/types";

export function extractYupErrors<T extends object>(
    e: yup.ValidationError,
    errors: YupErrorsList<T>,
) {
    e.inner.map((error) => {
        const path = error.path as NestedKeyOf<T> | null;

        if (path) {
            errors[path] = {
                messages: [...(errors[path]?.messages || []), error.message],
            };
        }
    });
}
