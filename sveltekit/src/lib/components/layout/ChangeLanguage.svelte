<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import { page } from "$app/state";
    import Dialog from "$lib/components/Dialog.svelte";
    import { m } from "$lib/paraglide/messages";
    import {
        getLocale,
        locales,
        localizeHref,
        setLocale,
        type Locale,
    } from "$lib/paraglide/runtime";
    import { GB, CZ } from "country-flag-icons/string/1x1";

    function a() {
        let a = "a"
    }

    function onSetLocale(locale: Locale) {
        setLocale(locale, { reload: false });

        goto(localizeHref(page.url.pathname, { locale }), {
            invalidateAll: true,
            noScroll: true,
        });
    }
</script>

<div class="wrapper">
    <Dialog>
        {#snippet button({ showModal, closeModal, isOpen })}
            <button
                type="button"
                class="lang-change-trigger"
                title={m["actions.change-language"]()}
                aria-label={m["actions.change-language"]()}
                onclick={() => {
                    isOpen
                        ? closeModal && closeModal()
                        : showModal && showModal();
                }}
                role="switch"
                aria-checked={isOpen}
            >
                {#if getLocale() === "cs"}
                    {@html CZ}
                {:else if getLocale() === "en"}
                    {@html GB}
                {/if}
            </button>
        {/snippet}
        {#snippet content()}
            <div class="lang-change-content">
                <h4 class="h4">{m["actions.change-language"]()}</h4>
                <section class="languages">
                    {#each locales as locale}
                        <button
                            disabled={locale === getLocale()}
                            onclick={() => onSetLocale(locale)}
                            title={locale === "cs"
                                ? "Čeština"
                                : locale === "en"
                                  ? "English"
                                  : ""}
                        >
                            {#if locale === "cs"}
                                {@html CZ}
                            {:else if locale === "en"}
                                {@html GB}
                            {/if}
                        </button>
                    {/each}
                </section>
            </div>
        {/snippet}
    </Dialog>
</div>

<style lang="scss">
    .wrapper {
        display: contents;

        :global(dialog) {
            width: 100%;
            max-width: 400px;
        }
    }

    .lang-change-trigger {
        transition: border 150ms;

        border-radius: 50%;
        overflow: hidden;
        border: 2px solid var(--color-primary-500);

        :global(svg) {
            width: 30px;
            height: 30px;
        }

        &:hover {
            border-color: var(--color-primary-300);
        }
    }

    .lang-change-content {
        h4 {
            margin-bottom: 10px;
        }

        .languages {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
            justify-content: center;

            button {
                transition: border 150ms;

                border-radius: 50%;
                overflow: hidden;
                border: 2px solid var(--color-primary-500);

                :global(svg) {
                    width: 60px;
                    height: 60px;
                }

                &:hover {
                    border-color: var(--color-primary-300);
                }

                &:disabled {
                    opacity: 0.5;
                }
            }
        }
    }
</style>
