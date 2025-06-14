<script lang="ts">
    import "$lib/app.css";
    import "$lib/styles/app.scss";
    import "$lib/styles/toaster.scss";
    import "$lib/styles/skeletonlab.scss";
    import "@fontsource-variable/montserrat";

    import { onMount } from "svelte";

    import Layout from "$lib/components/layout/Layout.svelte";
    import Toaster from "$lib/components/Toaster.svelte";
    import { m } from "$lib/paraglide/messages";
    import { useLocaleStore } from "$lib/stores/locale.svelte";

    let { children } = $props();

    const locale = useLocaleStore();

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

<Toaster />
{#key locale.locale}
    <Layout>
        {@render children()}
    </Layout>
{/key}
