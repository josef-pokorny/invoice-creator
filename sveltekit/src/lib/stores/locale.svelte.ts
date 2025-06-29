import { page } from "$app/state";
import { baseLocale, locales } from "$lib/paraglide/runtime";

export function useLocaleStore() {
    let locale = $derived(
        locales.find(
            (locale) => locale === page.url.pathname.substring(1, 3),
        ) || baseLocale,
    );

    return {
        get locale() {
            return locale;
        },
        set locale(value) {
            locale = value;
        },
    };
}
