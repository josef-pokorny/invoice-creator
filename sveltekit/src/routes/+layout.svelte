<script lang="ts">
    import "../app.css";
    import { AppBar } from "@skeletonlabs/skeleton-svelte";
    import "@fontsource-variable/montserrat";

    let { children } = $props();
</script>

<AppBar classes="sticky top-0 z-1000">
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
