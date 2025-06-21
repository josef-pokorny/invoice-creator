<script lang="ts">
    import SaveIcon from "@lucide/svelte/icons/save";
    import X from "@lucide/svelte/icons/x";
    import _ from "lodash";
    import { onMount } from "svelte";

    import ButtonRequestAres from "$lib/components/ButtonRequestAres.svelte";
    import Button from "$lib/components/form/Button.svelte";
    import Datepicker from "$lib/components/form/Datepicker.svelte";
    import Input from "$lib/components/form/Input.svelte";
    import Item from "$lib/components/form/Item.svelte";
    import Select from "$lib/components/form/Select.svelte";
    import Switch from "$lib/components/form/Switch.svelte";
    import SupplierFormPart from "$lib/components/invoice/SupplierFormPart.svelte";
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

    let url: string | null = $state(null);

    const formKey = useFormKeyStore();
    const formStore = $derived(
        useFormStore({
            get key() {
                return formKey.value.invoiceName;
            },
        }).value,
    );
    const invoiceValuesErrors = useFormErrorsStore();

    let issuedAtDate = $derived(
        formStore.issuedAt ? new Date(formStore.issuedAt) : undefined,
    );
    let paidAtDate = $derived(
        formStore.paidAt ? new Date(formStore.paidAt) : undefined,
    );
    let pickedUpAtDate = $derived(
        formStore.pickedUpAt ? new Date(formStore.pickedUpAt) : undefined,
    );
    let paymentDueDate = $derived(
        formStore.paymentDueDate
            ? new Date(formStore.paymentDueDate)
            : undefined,
    );

    const renderInvoiceFunc = (download?: boolean) =>
        renderInvoiceBlobUrl({
            invoiceProps: {
                invoiceData: createInvoiceData(formStore),
            },
            download,
            prefixFileName: `${m["labels.invoice"]()}`,
        });

    const renderInvoiceShare = () =>
        renderInvoiceFile({
            invoiceProps: {
                invoiceData: createInvoiceData(formStore),
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
            ...formStore,
            ...formStore.items,
            ...formStore.receiverBilling,
            ...formStore.supplierBilling,
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

    let dialogEl: HTMLDialogElement | null = $state(null);
    let isDialogOpened = $state(false);

    function closeDialog() {
        dialogEl?.close();
        isDialogOpened = false;
    }

    function openDialog() {
        dialogEl?.showModal();
        isDialogOpened = true;
    }

    let currentPageNum = $state(1);
</script>

<dialog bind:this={dialogEl} class="h-full max-h-full w-full max-w-full">
    <div class="pdf-full-preview">
        <form method="dialog" onsubmit={closeDialog}>
            <Button class="btn absolute top-0 right-0 z-50" type="submit">
                <X class="stroke-error-600 h-[48px] w-[48px]" />
            </Button>
        </form>

        <div class="pdf-viewer-wrap">
            {#await import('@josef-pokorny/svelte-pdf') then { default: PdfViewer }}
                {#await import(`../messages/${getLocale()}.json`) then { default: translations }}
                    {#if url && isDialogOpened}
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
</dialog>

<div class="page-wrap">
    <div class="w-full max-w-[380px] shrink-0">
        <form
            class="relative mb-15 gap-2 px-1"
            onsubmit={(e) => {
                e.preventDefault();
                renderPDF(true);
            }}
        >
            <div class="mb-15 flex w-full flex-col gap-2 px-1">
                <h2 class="h3 text-center">{m["labels.invoice"]()}</h2>

                <h3 class="h5 font-bold uppercase">{m["form.general"]()}</h3>
                <Select
                    label={m["labels.invoice-type"]()}
                    bind:value={formStore.invoiceType}
                    options={Object.values(EInvoiceType).map((invoiceType) => ({
                        label: m[`form.${invoiceType}`](),
                        value: invoiceType,
                    }))}
                />

                <Input
                    label={m["form.company"]()}
                    bind:value={formStore.companyName}
                />
                <Input label={m["form.refid"]()} bind:value={formStore.refId} />
                <Input
                    label={m["form.currency"]()}
                    bind:value={formStore.currency}
                />
                <Datepicker
                    error={invoiceValuesErrors.value["issuedAt"]}
                    label={m["form.issued-at"]()}
                    type="date"
                    bind:value={issuedAtDate}
                    bind:isoDate={formStore.issuedAt}
                />
                <Datepicker
                    error={invoiceValuesErrors.value["paidAt"]}
                    label={m["form.paid-at"]()}
                    type="date"
                    bind:value={paidAtDate}
                    bind:isoDate={formStore.paidAt}
                />
                <Datepicker
                    error={invoiceValuesErrors.value["pickedUpAt"]}
                    label={m["form.pickup-at"]()}
                    type="date"
                    bind:value={pickedUpAtDate}
                    bind:isoDate={formStore.pickedUpAt}
                />
                <Datepicker
                    error={invoiceValuesErrors.value["paymentDueDate"]}
                    label={m["form.payment-due"]()}
                    type="date"
                    bind:value={paymentDueDate}
                    bind:isoDate={formStore.paymentDueDate}
                />
                <Switch
                    classContainer="mt-4"
                    label={m["form.reverse-charge"]()}
                    bind:checked={formStore.reverseCharge}
                />

                <hr class="hr mx-7 my-5 w-[auto]" />

                <SupplierFormPart />

                <Input
                    label={m["form.custom-text-under-supplier"]()}
                    type="textarea"
                    bind:value={formStore.customTextUnderSupplier}
                />

                <hr class="hr mx-7 my-5 w-[auto]" />

                <h3 class="h5 font-bold uppercase">{m["form.receiver"]()}</h3>
                <Message id="receiver-ine-fill" clossable>
                    {m["text.you-can-fill-by-ine"]()}
                </Message>
                <Input
                    error={invoiceValuesErrors.value[
                        "receiverBilling.fullname"
                    ]}
                    label={m["form.fullname"]()}
                    bind:value={formStore.receiverBilling.fullname}
                />
                <Input
                    error={invoiceValuesErrors.value["receiverBilling.line1"]}
                    label={m["form.address"]()}
                    bind:value={formStore.receiverBilling.line1}
                />
                <Input
                    error={invoiceValuesErrors.value["receiverBilling.postal"]}
                    label={m["form.postal"]()}
                    bind:value={formStore.receiverBilling.postal}
                />
                <Input
                    error={invoiceValuesErrors.value["receiverBilling.city"]}
                    label={m["form.city"]()}
                    bind:value={formStore.receiverBilling.city}
                />
                <Input
                    label={m["form.country"]()}
                    bind:value={formStore.receiverBilling.country}
                />
                <Input
                    error={invoiceValuesErrors.value["receiverBilling.ine"]}
                    label={m["form.ine"]()}
                    bind:value={formStore.receiverBilling.ine}
                />
                {#if !invoiceValuesErrors.value["receiverBilling.ine"]}
                    <ButtonRequestAres
                        ine={formStore.receiverBilling.ine}
                        bind:billing={formStore.receiverBilling}
                    />
                {/if}
                <Input
                    label={m["form.vat"]()}
                    bind:value={formStore.receiverBilling.vat}
                />

                <hr class="hr mx-7 my-5 w-[auto]" />

                <h3 class="h5 font-bold uppercase">{m["form.items"]()}</h3>
                <Switch
                    label={m["form.count-vat"]()}
                    bind:checked={formStore.countVat}
                />
                <Switch
                    label={m["form.round-total"]()}
                    bind:checked={formStore.roundTotal}
                />

                {#each formStore.items as item (item.id)}
                    <Item {item} />
                {/each}

                <Button
                    class="btn btn-group preset-filled-success-100-900"
                    onclick={() => {
                        formStore.items.push(
                            _.cloneDeep({
                                ...DefaultItem,
                                id: createId("item"),
                            }),
                        );
                    }}
                    type="button"
                >
                    <SvgPlusCircle class="fill-success-600 w-10" />
                    {m["actions.add-item"]()}
                </Button>

                <hr class="hr mx-7 my-5 w-[auto]" />

                <Input
                    label={m["form.payment-type"]()}
                    bind:value={formStore.paymentType}
                />
                <Input
                    class="min-h-[8rem]"
                    label={m["form.payment-info"]()}
                    type="textarea"
                    bind:value={formStore.paymentInfo}
                />

                <hr class="hr mx-7 my-5 w-[auto]" />

                <Input
                    class="min-h-[8rem]"
                    label={m["form.custom-footer-text"]()}
                    type="textarea"
                    bind:value={formStore.customFooterText}
                />
            </div>

            <div
                class="sticky bottom-0 flex min-h-15 gap-1 bg-[var(--body-background-color-dark)]"
            >
                <Button
                    class="btn preset-filled-success-100-900 flex-1 font-medium"
                    type="submit"
                >
                    {m["actions.save"]()}
                </Button>
                <Button
                    class="btn preset-filled-primary-400-600"
                    onclick={openDialog}
                    type="button"
                >
                    {m["actions.full-preview"]()}
                </Button>
            </div>
            <div class="mt-2 flex h-1 min-h-15 gap-1">
                <Button
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
                </Button>
                <Button
                    class="btn preset-filled-success-100-900 h-full flex-1"
                    onclick={() => renderInvoiceFunc(true)}
                    type="button"
                >
                    <SaveIcon class="fill-success-600 w-10" />
                    {m["actions.download"]()}
                </Button>
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

    .page-wrap {
        @apply mt-8 mb-40 flex justify-center gap-x-1;

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
        background-color: var(--color-surface-900);
        display: grid;
        align-items: center;

        .pdf-viewer-wrap {
            overflow: auto;
            height: 100vh;
            height: 100dvh;

            :global(.control) {
                :global(.viewer) {
                    width: 100%;
                    overlay: auto;

                    :global(canvas) {
                        margin: 0 auto;
                        width: 100%;
                        max-width: 900px;
                    }
                }
            }
        }
    }
</style>
