<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import {
        baseLocale,
        getLocale,
        locales,
        localizeHref,
        setLocale,
    } from "$lib/paraglide/runtime";

    let localeFromUrl = $derived(
        locales.find(
            (locale) => locale === page.url.pathname.substring(1, 3),
        ) || baseLocale,
    );

    $effect(() => {
        if (localeFromUrl !== getLocale() && browser) {
            setLocale(getLocale(), { reload: false });

            goto(localizeHref(page.url.pathname, { locale: getLocale() }), {
                invalidateAll: true,
                noScroll: true,
            });
        }
    });
</script>
