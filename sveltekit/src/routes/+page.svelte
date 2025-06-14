<script lang="ts">
    import SaveIcon from "@lucide/svelte/icons/save";
    import X from "@lucide/svelte/icons/x";
    import { cloneDeep } from "lodash-es";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    import ButtonRequestAres from "$lib/components/ButtonRequestAres.svelte";
    import Datepicker from "$lib/components/form/Datepicker.svelte";
    import Input from "$lib/components/form/Input.svelte";
    import Item from "$lib/components/form/Item.svelte";
    import Select from "$lib/components/form/Select.svelte";
    import Switch from "$lib/components/form/Switch.svelte";
    import Message from "$lib/components/Message.svelte";
    import { m } from "$lib/paraglide/messages";
    import { getLocale } from "$lib/paraglide/runtime";
    import { DefaultItem, EInvoiceType } from "$lib/pdf/invoice-types";
    import {
        createInvoiceData,
        renderInvoiceBlobUrl,
        renderInvoiceFile,
    } from "$lib/pdf/utils";
    import { useFormKeyStore, useFormStore } from "$lib/stores/form.svelte";
    import { useFormErrorsStore } from "$lib/stores/form.svelte";
    import SvgPlusCircle from "$lib/svgs/svg-plus-circle.svelte";
    import SvgShare from "$lib/svgs/svg-share.svelte";
    import { createId } from "$lib/utils";

    const invoiceValuesErrors = useFormErrorsStore();

    let url: string | null = $state(null);

    const invoiceValuesKey = useFormKeyStore();
    let invoiceValues = $derived(
        useFormStore({
            get key() {
                return invoiceValuesKey.value.profileName;
            },
        }).value,
    );
    let issuedAtDate = $derived(
        invoiceValues.issuedAt ? new Date(invoiceValues.issuedAt) : undefined,
    );
    let paidAtDate = $derived(
        invoiceValues.paidAt ? new Date(invoiceValues.paidAt) : undefined,
    );
    let pickedUpAtDate = $derived(
        invoiceValues.pickedUpAt
            ? new Date(invoiceValues.pickedUpAt)
            : undefined,
    );
    let paymentDueDate = $derived(
        invoiceValues.paymentDueDate
            ? new Date(invoiceValues.paymentDueDate)
            : undefined,
    );

    const renderInvoiceFunc = (download?: boolean) =>
        renderInvoiceBlobUrl({
            invoiceProps: {
                invoiceData: createInvoiceData(invoiceValues),
            },
            download,
            prefixFileName: `${m["labels.invoice"]()}`,
        });

    const renderInvoiceShare = () =>
        renderInvoiceFile({
            invoiceProps: {
                invoiceData: createInvoiceData(invoiceValues),
            },
            prefixFileName: `${m["labels.invoice"]()}`,
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

    $effect(() => {
        document.body.style.overflow = isFullPreview ? "hidden" : "";
    });

    let currentPageNum = $state(1);
</script>

{#if isFullPreview}
    <div class="pdf-full-preview" transition:fade={{ duration: 120 }}>
        <button
            class="btn absolute top-0 right-0 z-50"
            onclick={() => {
                isFullPreview = false;
            }}
            type="button"
        >
            <X class="stroke-error-600 h-[48px] w-[48px]" />
        </button>
        <div class="pdf-viewer-wrap">
            {#await import('@josef-pokorny/svelte-pdf') then { default: PdfViewer }}
                {#await import(`../messages/${getLocale()}.json`) then { default: translations }}
                    {#if url}
                        {#key url}
                            <PdfViewer
                                pdfjsWorkerSrc={new URL(
                                    "pdfjs-dist/build/pdf.worker.mjs",
                                    import.meta.url,
                                ).toString()}
                                scale={4}
                                showButtons={["navigation", "pageInfo"]}
                                showTopButton={false}
                                translations={translations["svelte-pdf"]}
                                {url}
                                bind:currentPageNum
                            />
                        {/key}
                    {/if}
                {/await}
            {/await}
        </div>
    </div>
{/if}

<div class="main-wrap" aria-hidden={isFullPreview}>
    <div class="w-full max-w-[380px] shrink-0">
        <form
            class="relative m-0 mb-15 flex w-full flex-col gap-2"
            onsubmit={(e) => {
                e.preventDefault();
                renderPDF(true);
            }}
        >
            <h2 class="h3 text-center">{m["labels.invoice"]()}</h2>

            <h3 class="h5 font-bold uppercase">{m["form.general"]()}</h3>
            <Select bind:value={invoiceValues.invoiceType}>
                {#snippet options()}
                    {#each Object.values(EInvoiceType) as invoiceType (invoiceType)}
                        <option value={invoiceType}>
                            {m[`form.${invoiceType}`]()}
                        </option>
                    {/each}
                {/snippet}
            </Select>
            <Input
                label={m["form.company"]()}
                bind:value={invoiceValues.companyName}
            />
            <Input label={m["form.refid"]()} bind:value={invoiceValues.refId} />
            <Input
                label={m["form.currency"]()}
                bind:value={invoiceValues.currency}
            />
            <Datepicker
                error={invoiceValuesErrors.value["issuedAt"]}
                label={m["form.issued-at"]()}
                type="date"
                bind:value={issuedAtDate}
                bind:isoDate={invoiceValues.issuedAt}
            />
            <Datepicker
                error={invoiceValuesErrors.value["paidAt"]}
                label={m["form.paid-at"]()}
                type="date"
                bind:value={paidAtDate}
                bind:isoDate={invoiceValues.paidAt}
            />
            <Datepicker
                error={invoiceValuesErrors.value["pickedUpAt"]}
                label={m["form.pickup-at"]()}
                type="date"
                bind:value={pickedUpAtDate}
                bind:isoDate={invoiceValues.pickedUpAt}
            />
            <Datepicker
                error={invoiceValuesErrors.value["paymentDueDate"]}
                label={m["form.payment-due"]()}
                type="date"
                bind:value={paymentDueDate}
                bind:isoDate={invoiceValues.paymentDueDate}
            />
            <Switch
                classContainer="mt-4"
                label={m["form.reverse-charge"]()}
                bind:checked={invoiceValues.reverseCharge}
            />

            <hr class="hr mx-7 my-5 w-[auto]" />

            <h3 class="h5 font-bold uppercase">{m["form.supplier"]()}</h3>
            <Message id="supplier-ine-fill" clossable>
                {m["text.you-can-fill-by-ine"]()}
            </Message>
            <Input
                error={invoiceValuesErrors.value["supplierBilling.fullname"]}
                label={m["form.fullname"]()}
                bind:value={invoiceValues.supplierBilling.fullname}
            />
            <Input
                error={invoiceValuesErrors.value["supplierBilling.line1"]}
                label={m["form.address"]()}
                bind:value={invoiceValues.supplierBilling.line1}
            />
            <Input
                error={invoiceValuesErrors.value["supplierBilling.postal"]}
                label={m["form.postal"]()}
                bind:value={invoiceValues.supplierBilling.postal}
            />
            <Input
                error={invoiceValuesErrors.value["supplierBilling.city"]}
                label={m["form.city"]()}
                bind:value={invoiceValues.supplierBilling.city}
            />
            <Input
                label={m["form.country"]()}
                bind:value={invoiceValues.supplierBilling.country}
            />
            <Input
                error={invoiceValuesErrors.value["supplierBilling.ine"]}
                label={m["form.ine"]()}
                bind:value={invoiceValues.supplierBilling.ine}
            />
            {#if !invoiceValuesErrors.value["supplierBilling.ine"]}
                <ButtonRequestAres
                    ine={invoiceValues.supplierBilling.ine}
                    bind:billing={invoiceValues.supplierBilling}
                />
            {/if}

            <Input
                label={m["form.vat"]()}
                bind:value={invoiceValues.supplierBilling.vat}
            />

            <Switch
                label={m["form.is-selfemployed"]()}
                bind:checked={invoiceValues.isSupplierSelfEmployed}
            />

            {#if !invoiceValues.isSupplierSelfEmployed}
                <Input
                    label={m["form.custom-text-under-supplier"]()}
                    type="textarea"
                    bind:value={invoiceValues.customTextUnderSupplier}
                />
            {/if}

            <hr class="hr mx-7 my-5 w-[auto]" />

            <h3 class="h5 font-bold uppercase">{m["form.receiver"]()}</h3>
            <Message id="receiver-ine-fill" clossable>
                {m["text.you-can-fill-by-ine"]()}
            </Message>
            <Input
                error={invoiceValuesErrors.value["billing.fullname"]}
                label={m["form.fullname"]()}
                bind:value={invoiceValues.billing.fullname}
            />
            <Input
                error={invoiceValuesErrors.value["billing.line1"]}
                label={m["form.address"]()}
                bind:value={invoiceValues.billing.line1}
            />
            <Input
                error={invoiceValuesErrors.value["billing.postal"]}
                label={m["form.postal"]()}
                bind:value={invoiceValues.billing.postal}
            />
            <Input
                error={invoiceValuesErrors.value["billing.city"]}
                label={m["form.city"]()}
                bind:value={invoiceValues.billing.city}
            />
            <Input
                label={m["form.country"]()}
                bind:value={invoiceValues.billing.country}
            />
            <Input
                error={invoiceValuesErrors.value["billing.ine"]}
                label={m["form.ine"]()}
                bind:value={invoiceValues.billing.ine}
            />
            {#if !invoiceValuesErrors.value["billing.ine"]}
                <ButtonRequestAres
                    ine={invoiceValues.billing.ine}
                    bind:billing={invoiceValues.billing}
                />
            {/if}
            <Input
                label={m["form.vat"]()}
                bind:value={invoiceValues.billing.vat}
            />

            <hr class="hr mx-7 my-5 w-[auto]" />

            <h3 class="h5 font-bold uppercase">{m["form.items"]()}</h3>
            <Switch
                label={m["form.count-vat"]()}
                bind:checked={invoiceValues.countVat}
            />
            <Switch
                label={m["form.round-total"]()}
                bind:checked={invoiceValues.roundTotal}
            />

            {#each invoiceValues.items as item (item.id)}
                <Item {item} />
            {/each}

            <div>
                <button
                    class="btn btn-group preset-filled-success-100-900"
                    onclick={() => {
                        invoiceValues.items.push(
                            cloneDeep({
                                ...DefaultItem,
                                id: createId(),
                            }),
                        );
                    }}
                    type="button"
                >
                    <SvgPlusCircle class="fill-success-600 w-10" />
                    {m["actions.add-item"]()}
                </button>
            </div>

            <hr class="hr mx-7 my-5 w-[auto]" />

            <Input
                label={m["form.payment-type"]()}
                bind:value={invoiceValues.paymentType}
            />
            <Input
                class="min-h-[8rem]"
                label={m["form.payment-info"]()}
                type="textarea"
                bind:value={invoiceValues.paymentInfo}
            />

            <hr class="hr mx-7 my-5 w-[auto]" />

            <Input
                class="min-h-[8rem]"
                label={m["form.custom-footer-text"]()}
                type="textarea"
                bind:value={invoiceValues.customFooterText}
            />

            <hr class="hr mx-7 my-5 w-[auto]" />

            <div
                class="sticky bottom-0 flex min-h-15 gap-1 bg-[var(--body-background-color-dark)]"
            >
                <button
                    class="btn preset-filled-success-100-900 flex-1 font-medium"
                    type="submit"
                >
                    {m["actions.save"]()}
                </button>
                <button
                    class="btn preset-filled-primary-400-600"
                    onclick={() => {
                        isFullPreview = !isFullPreview;
                    }}
                    type="button"
                >
                    {m["actions.full-preview"]()}
                </button>
            </div>
            <div class="mt-2 flex h-1 min-h-15 gap-1">
                <button
                    class="btn preset-filled-primary-400-600 h-full"
                    onclick={async () => {
                        await navigator.share({
                            files: [await renderInvoiceShare()],
                            title: "Images",
                            text: "Beautiful images",
                        });
                    }}
                    title={m["labels.share"]()}
                    type="button"
                >
                    <SvgShare class="w-10 fill-white" />
                </button>
                <button
                    class="btn preset-filled-success-100-900 h-full flex-1"
                    onclick={() => renderInvoiceFunc(true)}
                    type="button"
                >
                    <SaveIcon class="fill-success-600 w-10" />
                    {m["actions.download"]()}
                </button>
            </div>
        </form>
    </div>

    <div class="pdf-viewer-wrap">
        {#await import('@josef-pokorny/svelte-pdf') then { default: PdfViewer }}
            {#await import(`../messages/${getLocale()}.json`) then { default: translations }}
                {#if url}
                    {#key url}
                        <PdfViewer
                            pdfjsWorkerSrc={new URL(
                                "pdfjs-dist/build/pdf.worker.mjs",
                                import.meta.url,
                            ).toString()}
                            scale={2.5}
                            showButtons={["navigation", "pageInfo"]}
                            showTopButton={false}
                            translations={translations["svelte-pdf"]}
                            {url}
                            bind:currentPageNum
                        />
                    {/key}
                {/if}
            {/await}
        {/await}
    </div>
</div>

<style lang="scss">
    .pdf-viewer-wrap {
        :global(.svelte-pdf) {
            height: 100%;

            --theme-color: var(--color-primary-300);
        }

        :global(.control) {
            margin: 0;
            padding: 0;
            border-radius: 0;
            border: 0;

            display: flex;
            flex-direction: column;
            height: 100%;

            :global(.line) {
                background-color: var(--color-surface-900);
                justify-content: start;
                padding: 5px 10px;
                gap: 15px;
                margin: 0;

                :global(.melt-tooltip-container .content),
                :global(.melt-tooltip-container .melt-tooltip-arrow) {
                    background-color: var(--color-surface-700) !important;
                    color: var(--color-white);

                    &::before {
                        display: none;
                    }
                }

                :global(.button-control) {
                    border: 0;
                }
            }

            :global(.viewer) {
                flex: 1;
                min-width: 1px;
            }
        }
    }

    .main-wrap {
        @apply mt-8 mb-40 flex justify-center gap-x-3 px-2;

        .pdf-viewer-wrap {
            @apply sticky top-0 z-1 m-0 h-[100svh] max-w-[750px] min-w-1 flex-1;

            :global(.viewer) {
                :global(canvas) {
                    min-width: 650px;
                    width: 115%;
                }
            }

            @media (max-width: 850px) {
                position: unset;
                width: 100%;
            }
        }

        @media (max-width: 850px) {
            flex-direction: column;
            align-items: center;
        }
    }

    .pdf-full-preview {
        @apply fixed top-1/2 left-1/2 z-10 h-[100vh] w-[100vw] -translate-1/2;
        background-color: var(--color-surface-900);
        display: grid;
        align-items: center;

        .pdf-viewer-wrap {
            overflow: auto;
            height: 100%;
            width: 100%;

            :global(.viewer) {
                :global(canvas) {
                    margin: 0 auto;
                    height: 100%;
                    max-height: 1500px;
                }
            }
        }
    }
</style>
