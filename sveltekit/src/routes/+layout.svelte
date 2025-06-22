<script lang="ts">
    import "$lib/app.css";
    import "$lib/styles/app.scss";
    import "$lib/styles/toaster.scss";
    import "$lib/styles/skeletonlab.scss";
    import "$lib/styles/shadows.scss";
    import "$lib/styles/form.scss";
    import "@fontsource-variable/montserrat";

    import Layout from "$lib/components/layout/Layout.svelte";
    import LocaleSync from "$lib/components/layout/LocaleSync.svelte";
    import PWAMeta from "$lib/components/layout/PWAMeta.svelte";
    import Toaster from "$lib/components/Toaster.svelte";
    import { m } from "$lib/paraglide/messages";
    import TanstackQueryWrapper from "$lib/query/wrapper/TanstackQueryWrapper.svelte";
    import { useLocaleStore } from "$lib/stores/locale.svelte";

    let { children } = $props();

    const locale = useLocaleStore();
</script>

<!-- <Crawl /> -->
<svelte:head>
    {#key locale.locale}
        {@const originUrl = "https://invoice-creator.josefpokorny.cz"}

        <title>{m["meta.title"]()}</title>

        <meta name="description" content={m["meta.description"]()} />
        <meta name="keywords" content={m["meta.keywords"]()} />
        <meta name="author" content="Josef Pokorný" />

        <meta content={m["meta.title"]()} property="og:title" />
        <meta content={m["meta.description"]()} property="og:description" />
        <meta content="website" property="og:type" />
        <meta content={originUrl} property="og:url" />
        <meta content="{originUrl}/favicon.png" property="og:image" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={m["meta.title"]()} />
        <meta name="twitter:description" content={m["meta.description"]()} />
        <meta name="twitter:image" content="{originUrl}/favicon.png" />

        <link href={originUrl} rel="canonical" />
        <link href="{originUrl}/favicon.png" rel="icon" type="image/x-icon" />
    {/key}
</svelte:head>

{#key locale.locale}
    <TanstackQueryWrapper>
        <LocaleSync />
        <PWAMeta />

        <Toaster />

        <Layout>
            {@render children()}
        </Layout>
    </TanstackQueryWrapper>
{/key}
