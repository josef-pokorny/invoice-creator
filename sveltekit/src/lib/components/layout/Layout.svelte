<script lang="ts">
    import ChangeLanguage from "$lib/components/layout/ChangeLanguage.svelte";
    import PWAMeta from "$lib/components/layout/PWAMeta.svelte";
    import "$lib/app.css";
    import "$lib/styles/app.scss";
    import { AppBar, Toaster } from "@skeletonlabs/skeleton-svelte";
    import "@fontsource-variable/montserrat";
    import { page } from "$app/state";
    import { useToasterStore } from "$lib/stores/toaster";
    import { locales, localizeHref, setLocale } from "$lib/paraglide/runtime";
    import SvgGithub from "$lib/svgs/svg-github.svelte";
    import { goto } from "$app/navigation";
    import LocaleSync from "$lib/components/layout/LocaleSync.svelte";
    import { type Snippet } from "svelte";
    import ChangeProfile from "../ChangeProfile.svelte";

    let { children, locale }: { children: Snippet; locale: string } = $props();

    const toaster = useToasterStore();
</script>

<Toaster toaster={toaster.value}></Toaster>

<LocaleSync />

<PWAMeta />
{#await import('$lib/components/layout/PWAReloadPrompt.svelte') then { default: ReloadPrompt }}
    <ReloadPrompt />
{/await}

<AppBar toolbarClasses="items-center">
    {#snippet lead()}
        <div class="lead w-[40px]">
            <ChangeLanguage />
        </div>
    {/snippet}
    {#snippet trail()}
        <div class="trail w-[40px]">
            <ChangeProfile />
        </div>
    {/snippet}
    <h1 class="h1 text-primary-100 text-[1.1rem]">Invoice Creator</h1>
</AppBar>

<main class="p-1">
    {@render children()}
</main>

<footer>
    <div class="footer-items">
        <div class="footer-item links">
            {#each locales as lang}
                <a
                    class="anchor"
                    href={localizeHref(page.url.pathname, { locale: lang })}
                    aria-disabled={lang === locale}
                    onclick={(e) => {
                        e.preventDefault();
                        setLocale(lang, { reload: false });

                        goto(
                            localizeHref(page.url.pathname, {
                                locale: lang,
                            }),
                            {
                                invalidateAll: true,
                                noScroll: true,
                            },
                        );
                    }}
                >
                    {#if lang === "cs"}
                        Čeština
                    {:else if lang === "en"}
                        English
                    {/if}
                </a>
            {/each}
        </div>
    </div>
    <div class="footer-bottom">
        <p class="by">
            <a href="https://github.com/josef-pokorny"
                >by <b>Josef Pokorný</b>
            </a>
        </p>
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

<style lang="scss">
    .lead,
    .trail {
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
