<script lang="ts">
    import PdfViewer from "svelte-pdf";
    import { onMount } from "svelte";
    import { useFormKeyStore, useFormStore } from "$lib/stores/form.svelte";
    import { m } from "$lib/paraglide/messages";
    import { fade } from "svelte/transition";
    import { createInvoiceData, renderInvoiceBlobUrl } from "$lib/pdf/utils";
    import { X } from "@lucide/svelte";
    import InvoiceForm from "$lib/components/InvoiceForm.svelte";

    // region:    --- Form validation

    // endregion: --- Form validation

    let url: string | null = $state(null);

    const invoiceValuesKey = useFormKeyStore();
    let invoiceValues = $derived(
        useFormStore({
            get key() {
                return invoiceValuesKey.value.profileName;
            },
        }).value,
    );

    const renderInvoiceFunc = (download?: boolean) =>
        renderInvoiceBlobUrl({
            invoiceProps: {
                invoiceData: createInvoiceData(invoiceValues),
            },
            download,
            prefixFileName: `${m["labels.invoice"]()} - `,
        });

    let timeoutId: number;
    function renderPDF(skipTimeout?: boolean) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(
            () => {
                renderInvoiceFunc().then((d) => {
                    if (url) window.URL.revokeObjectURL(url);
                    url = d;
                });
            },
            skipTimeout ? 0 : 1000,
        );
    }

    let isMounted = false;
    $effect(() => {
        ({
            ...invoiceValues,
            ...invoiceValues.items,
            ...invoiceValues.billing,
            ...invoiceValues.supplierBilling,
        });

        if (isMounted) {
            renderPDF();
        }
    });

    onMount(() => {
        renderPDF(true);
        isMounted = true;

        return () => {
            clearTimeout(timeoutId);
        };
    });

    let isFullPreview = $state(false);
    let fullPreviewElem: HTMLElement | undefined = $state();

    $effect(() => {
        document.body.style.overflow = isFullPreview ? "hidden" : "";
    });
</script>

{#if isFullPreview}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        bind:this={fullPreviewElem}
        transition:fade={{ duration: 120 }}
        class="pdf-full-preview"
        onclick={() => {
            isFullPreview = false;
        }}
    >
        <button
            onclick={() => {
                isFullPreview = false;
            }}
            type="button"
            class="btn absolute top-0 left-0"
        >
            <X class="stroke-error-600 h-[64px] w-[64px]" />
        </button>
        <div class="pdf-viewer-wrap">
            {#if url}
                {#key url}
                    <PdfViewer
                        {url}
                        showTopButton={false}
                        showButtons={[]}
                        scale={4}
                    />
                {/key}
            {/if}
        </div>
    </div>
{/if}

<div class="main-wrap" aria-hidden={isFullPreview}>
    <div class="w-full max-w-[380px] shrink-0">
        <InvoiceForm {renderPDF} {renderInvoiceFunc} bind:isFullPreview />
    </div>

    <div class="pdf-viewer-wrap">
        {#if url}
            {#key url}
                <PdfViewer
                    {url}
                    showTopButton={false}
                    showButtons={[]}
                    scale={3}
                />
            {/key}
        {/if}
    </div>
</div>

<style lang="scss">
    .main-wrap {
        @apply relative mt-8 mb-40 flex justify-center gap-x-3 px-2;

        .pdf-viewer-wrap {
            @apply sticky top-0 z-1 m-0 h-[100svh] w-[100%] max-w-[750px] flex-1 overflow-auto;

            :global(.parent),
            :global(.control) {
                margin: 0;
                padding: 0;
                border-radius: 0;
                border: 0;
                height: 100%;
            }

            :global(.viewer) {
                border: 0;
            }

            :global(.parent) {
                width: 100%;
                overflow: hidden;
                min-width: 650px;
                max-width: 720px;

                :global(canvas) {
                    width: 100%;
                }
            }
        }

        @media (max-width: 850px) {
            flex-direction: column;
            align-items: center;
        }
    }

    .pdf-full-preview {
        @apply fixed top-1/2 left-1/2 z-10 h-[100vh] w-[100vw] -translate-1/2;
        background-color: rgba(0, 0, 0, 0.555);
        display: grid;
        align-items: center;

        .pdf-viewer-wrap {
            overflow: auto;
            height: 100%;
            width: auto;

            :global(.parent) {
                width: auto;
                min-width: 0;
                margin: auto;
            }

            :global(.viewer),
            :global(.control),
            :global(.parent),
            :global(canvas) {
                width: auto;
                height: 100%;
                border: 0;
                border-radius: 0;
            }

            :global(.control) {
                @apply bg-surface-950;
            }

            :global(canvas) {
                margin: 0 auto;
                pointer-events: none;
            }
        }
    }
</style>
