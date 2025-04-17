<script lang="ts">
    import ChangeLanguage from "$lib/components/layout/ChangeLanguage.svelte";
    import PWAMeta from "$lib/components/PWAMeta.svelte";
    import "$lib/app.css";
    import "$lib/styles/app.scss";
    import { AppBar, Toaster } from "@skeletonlabs/skeleton-svelte";
    import "@fontsource-variable/montserrat";
    import { page } from "$app/state";
    import { m } from "$lib/paraglide/messages";
    import { useToasterStore } from "$lib/stores/toaster";
    import {
        baseLocale,
        getLocale,
        locales,
        localizeHref,
        setLocale,
    } from "$lib/paraglide/runtime";
    import SvgGithub from "$lib/svgs/svg-github.svelte";

    let { children } = $props();

    const toaster = useToasterStore();

    let locale = $derived(
        locales.find(
            (locale) => locale === page.url.pathname.substring(1, 3),
        ) || baseLocale,
    );
</script>

<!-- <Crawl /> -->
<svelte:head>
    {#key locale}
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
        <link
            rel="icon"
            href="{page.url.origin}/favicon.png"
            type="image/x-icon"
        />
    {/key}
</svelte:head>

{#key locale}
    <Toaster toaster={toaster.value}></Toaster>

    <PWAMeta />
    {#await import('$lib/components/ReloadPrompt.svelte') then { default: ReloadPrompt }}
        <ReloadPrompt />
    {/await}

    <AppBar toolbarClasses="items-center">
        {#snippet lead()}
            <div class="lead w-[40px]">
                <ChangeLanguage />
            </div>
        {/snippet}
        {#snippet trail()}
            <div class="w-[40px]"></div>
        {/snippet}
        <h1 class="h1 text-primary-100 text-[1.1rem]">Invoice Creator</h1>
    </AppBar>

    <main class="p-1">
        {@render children()}
    </main>

    <footer>
        <div class="footer-items">
            <div class="footer-item links">
                {#each locales as locale}
                    <a
                        class="anchor"
                        href={localizeHref(page.url.pathname, { locale })}
                        aria-disabled={locale === getLocale()}
                        onclick={() => setLocale(locale)}
                    >
                        {#if locale === "cs"}
                            Čeština
                        {:else if locale === "en"}
                            English
                        {/if}
                    </a>
                {/each}
            </div>
        </div>
        <div class="footer-bottom">
            <p class="by">by <b>Josef Pokorný</b></p>
            <a
                class="anchor"
                href="https://github.com/josef-pokorny/invoice-creator"
                target="_blank"
                title="github"
            >
                <SvgGithub />
            </a>
        </div>
    </footer>
{/key}

<style lang="scss">
    .lead {
        display: flex;
        align-items: center;
    }

    footer {
        border-top: 2px solid var(--color-surface-800);
        padding: 15px;
        margin-top: 15px;

        a[aria-disabled="true"] {
            opacity: 0.7;
            pointer-events: none;
        }

        .footer-items {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            .footer-item {
                &.links {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 2px;
                }
            }
        }

        .footer-bottom {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 5px;

            text-align: center;
            width: 100%;

            .by {
                font-size: 0.9rem;
            }

            a {
                :global(svg) {
                    fill: var(--anchor-color);

                    &:hover {
                        opacity: 0.85;
                    }
                }
            }
        }
    }
</style>
