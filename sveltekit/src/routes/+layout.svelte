<script lang="ts">
    import { m } from "$lib/paraglide/messages";
    import Layout from "$lib/components/layout/Layout.svelte";
    import { baseLocale, locales } from "$lib/paraglide/runtime";
    import { page } from "$app/state";
    import { onMount } from "svelte";

    let { children } = $props();

    let locale = $derived(
        locales.find(
            (locale) => locale === page.url.pathname.substring(1, 3),
        ) || baseLocale,
    );

    onMount(() => {
        const timeoutId = setTimeout(() => {
            const container = document.querySelector(
                "#svelte-app-container",
            ) as HTMLDivElement;

            document.body.style.overflow = "auto";

            if (container) {
                container.style.opacity = "1";
            }
        }, 0);

        return () => {
            clearTimeout(timeoutId);
        };
    });
</script>

<!-- <Crawl /> -->
<svelte:head>
    {#key locale}
        {@const originUrl = "https://invoice-creator.josefpokorny.cz"}

        <title>{m["meta.title"]()}</title>

        <meta name="description" content={m["meta.description"]()} />
        <meta name="keywords" content={m["meta.keywords"]()} />
        <meta name="author" content="Josef Pokorný" />

        <meta property="og:title" content={m["meta.title"]()} />
        <meta property="og:description" content={m["meta.description"]()} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={originUrl} />
        <meta property="og:image" content="{originUrl}/favicon.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={m["meta.title"]()} />
        <meta name="twitter:description" content={m["meta.description"]()} />
        <meta name="twitter:image" content="{originUrl}/favicon.png" />

        <link rel="canonical" href={originUrl} />
        <link rel="icon" href="{originUrl}/favicon.png" type="image/x-icon" />
    {/key}
</svelte:head>

{#key locale}
    <Layout {locale}>
        {@render children()}
    </Layout>
{/key}
