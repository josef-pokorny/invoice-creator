<script lang="ts">
    import "../app.css";
    import { AppBar } from "@skeletonlabs/skeleton-svelte";
    import "@fontsource-variable/montserrat";
    import { page } from "$app/state";
    import { m } from "$lib/paraglide/messages";

    let { children } = $props();
</script>

<svelte:head>
    <title>{m["meta.title"]()}</title>

    <meta name="description" content={m["meta.description"]()} />
    <meta name="keywords" content={m["meta.keywords"]()} />
    <meta name="author" content="Josef Pokorný" />

    <meta property="og:title" content={m["meta.title"]()} />
    <meta property="og:description" content={m["meta.description"]()} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={page.url.origin} />
    <meta property="og:image" content="{page.url.origin}/favicon.png" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={m["meta.title"]()} />
    <meta name="twitter:description" content={m["meta.description"]()} />
    <meta name="twitter:image" content="{page.url.origin}/favicon.png" />

    <link rel="canonical" href={page.url.origin} />
    <link rel="icon" href="{page.url.origin}/favicon.png" type="image/x-icon" />
</svelte:head>

<AppBar>
    {#snippet lead()}
        <div></div>
    {/snippet}
    {#snippet trail()}
        <div></div>
    {/snippet}
    <h1 class="h1 text-primary-100 text-[1.1rem]">Invoice Creator</h1>
</AppBar>

<main class="p-1">
    {@render children()}
</main>
