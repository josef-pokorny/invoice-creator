<script lang="ts">
    import PdfViewer from "svelte-pdf";
    import { onMount } from "svelte";
    import { useFormKeyStore, useFormStore } from "$lib/stores/form.svelte";
    import { m } from "$lib/paraglide/messages";
    import { fade } from "svelte/transition";
    import {
        createInvoiceData,
        renderInvoiceBlobUrl,
        renderInvoiceFile,
    } from "$lib/pdf/utils";
    import X from "@lucide/svelte/icons/x";
    import Input from "$lib/components/form/Input.svelte";
    import Item from "$lib/components/form/Item.svelte";
    import SvgPlusCircle from "$lib/svgs/svg-plus-circle.svelte";
    import Switch from "$lib/components/form/Switch.svelte";
    import Datepicker from "$lib/components/form/Datepicker.svelte";
    import { DefaultItem, EInvoiceType } from "$lib/pdf/invoice-types";
    import Select from "$lib/components/form/Select.svelte";
    import SaveIcon from "@lucide/svelte/icons/save";
    import ButtonRequestAres from "$lib/components/ButtonRequestAres.svelte";
    import Message from "$lib/components/Message.svelte";
    import { cloneDeep } from "lodash-es";
    import { createId } from "$lib/utils";
    import { useFormErrorsStore } from "$lib/stores/form.svelte";
    import SvgShare from "$lib/svgs/svg-share.svelte";

    let invoiceValuesErrors = useFormErrorsStore();

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
    let issuedAtDate = $derived(
        invoiceValues?.issuedAt ? new Date(invoiceValues.issuedAt) : undefined,
    );
    let paidAtDate = $derived(
        invoiceValues?.paidAt ? new Date(invoiceValues.paidAt) : undefined,
    );
    let pickedUpAtDate = $derived(
        invoiceValues?.pickedUpAt
            ? new Date(invoiceValues.pickedUpAt)
            : undefined,
    );
    let paymentDueDate = $derived(
        invoiceValues?.paymentDueDate
            ? new Date(invoiceValues?.paymentDueDate)
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
    >
        <button
            onclick={() => {
                isFullPreview = false;
            }}
            type="button"
            class="btn absolute top-0 right-0 z-50"
        >
            <X class="stroke-error-600 h-[48px] w-[48px]" />
        </button>
        <div class="pdf-viewer-wrap">
            {#if url}
                {#key url}
                    <PdfViewer
                        {url}
                        showTopButton={false}
                        showButtons={["navigation"]}
                        scale={4}
                    />
                {/key}
            {/if}
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
                bind:value={invoiceValues.companyName}
                label={m["form.company"]()}
            />
            <Input bind:value={invoiceValues.refId} label={m["form.refid"]()} />
            <Input
                bind:value={invoiceValues.currency}
                label={m["form.currency"]()}
            />
            <Datepicker
                label={m["form.issued-at"]()}
                type="date"
                bind:value={issuedAtDate}
                bind:isoDate={invoiceValues.issuedAt}
                error={invoiceValuesErrors.value["issuedAt"]}
            />
            <Datepicker
                label={m["form.paid-at"]()}
                type="date"
                bind:value={paidAtDate}
                bind:isoDate={invoiceValues.paidAt}
                error={invoiceValuesErrors.value["paidAt"]}
            />
            <Datepicker
                label={m["form.pickup-at"]()}
                type="date"
                bind:value={pickedUpAtDate}
                bind:isoDate={invoiceValues.pickedUpAt}
                error={invoiceValuesErrors.value["pickedUpAt"]}
            />
            <Datepicker
                label={m["form.payment-due"]()}
                type="date"
                bind:value={paymentDueDate}
                bind:isoDate={invoiceValues.paymentDueDate}
                error={invoiceValuesErrors.value["paymentDueDate"]}
            />
            <Switch
                classContainer="mt-4"
                bind:checked={invoiceValues.reverseCharge}
                label={m["form.reverse-charge"]()}
            />

            <hr class="hr mx-7 my-5 w-[auto]" />

            <h3 class="h5 font-bold uppercase">{m["form.supplier"]()}</h3>
            <Message clossable id="supplier-ine-fill">
                {m["text.you-can-fill-by-ine"]()}
            </Message>
            <Input
                bind:value={invoiceValues.supplierBilling.fullname}
                label={m["form.fullname"]()}
                error={invoiceValuesErrors.value["supplierBilling.fullname"]}
            />
            <Input
                bind:value={invoiceValues.supplierBilling.line1}
                label={m["form.address"]()}
                error={invoiceValuesErrors.value["supplierBilling.line1"]}
            />
            <Input
                bind:value={invoiceValues.supplierBilling.postal}
                label={m["form.postal"]()}
                error={invoiceValuesErrors.value["supplierBilling.postal"]}
            />
            <Input
                bind:value={invoiceValues.supplierBilling.city}
                label={m["form.city"]()}
                error={invoiceValuesErrors.value["supplierBilling.city"]}
            />
            <Input
                bind:value={invoiceValues.supplierBilling.country}
                label={m["form.country"]()}
            />
            <Input
                bind:value={invoiceValues.supplierBilling.ine}
                label={m["form.ine"]()}
                error={invoiceValuesErrors.value["supplierBilling.ine"]}
            />
            {#if !invoiceValuesErrors.value["supplierBilling.ine"]}
                <ButtonRequestAres
                    ine={invoiceValues.supplierBilling.ine}
                    bind:billing={invoiceValues.supplierBilling}
                />
            {/if}

            <Input
                bind:value={invoiceValues.supplierBilling.vat}
                label={m["form.vat"]()}
            />

            <Switch
                bind:checked={invoiceValues.isSupplierSelfEmployed}
                label={m["form.is-selfemployed"]()}
            />

            {#if !invoiceValues.isSupplierSelfEmployed}
                <Input
                    bind:value={invoiceValues.customTextUnderSupplier}
                    label={m["form.custom-text-under-supplier"]()}
                    type="textarea"
                />
            {/if}

            <hr class="hr mx-7 my-5 w-[auto]" />

            <h3 class="h5 font-bold uppercase">{m["form.receiver"]()}</h3>
            <Message clossable id="receiver-ine-fill">
                {m["text.you-can-fill-by-ine"]()}
            </Message>
            <Input
                bind:value={invoiceValues.billing.fullname}
                label={m["form.fullname"]()}
                error={invoiceValuesErrors.value["billing.fullname"]}
            />
            <Input
                bind:value={invoiceValues.billing.line1}
                label={m["form.address"]()}
                error={invoiceValuesErrors.value["billing.line1"]}
            />
            <Input
                bind:value={invoiceValues.billing.postal}
                label={m["form.postal"]()}
                error={invoiceValuesErrors.value["billing.postal"]}
            />
            <Input
                bind:value={invoiceValues.billing.city}
                label={m["form.city"]()}
                error={invoiceValuesErrors.value["billing.city"]}
            />
            <Input
                bind:value={invoiceValues.billing.country}
                label={m["form.country"]()}
            />
            <Input
                bind:value={invoiceValues.billing.ine}
                label={m["form.ine"]()}
                error={invoiceValuesErrors.value["billing.ine"]}
            />
            {#if !invoiceValuesErrors.value["billing.ine"]}
                <ButtonRequestAres
                    ine={invoiceValues.billing.ine}
                    bind:billing={invoiceValues.billing}
                />
            {/if}
            <Input
                bind:value={invoiceValues.billing.vat}
                label={m["form.vat"]()}
            />

            <hr class="hr mx-7 my-5 w-[auto]" />

            <h3 class="h5 font-bold uppercase">{m["form.items"]()}</h3>
            <Switch
                bind:checked={invoiceValues.countVat}
                label={m["form.count-vat"]()}
            />
            <Switch
                bind:checked={invoiceValues.roundTotal}
                label={m["form.round-total"]()}
            />

            {#each invoiceValues.items as item (item.id)}
                <Item {item} />
            {/each}

            <div>
                <button
                    onclick={() => {
                        invoiceValues.items.push(
                            cloneDeep({
                                ...DefaultItem,
                                id: createId(),
                            }),
                        );
                    }}
                    type="button"
                    class="btn btn-group preset-filled-success-100-900"
                >
                    <SvgPlusCircle class="fill-success-600 w-10" />
                    {m["actions.add-item"]()}
                </button>
            </div>

            <hr class="hr mx-7 my-5 w-[auto]" />

            <Input
                bind:value={invoiceValues.paymentType}
                label={m["form.payment-type"]()}
            />
            <Input
                bind:value={invoiceValues.paymentInfo}
                label={m["form.payment-info"]()}
                type="textarea"
                class="min-h-[8rem]"
            />

            <hr class="hr mx-7 my-5 w-[auto]" />

            <Input
                bind:value={invoiceValues.customFooterText}
                label={m["form.custom-footer-text"]()}
                type="textarea"
                class="min-h-[8rem]"
            />

            <hr class="hr mx-7 my-5 w-[auto]" />

            <div
                class="sticky bottom-0 flex min-h-15 gap-1 bg-[var(--body-background-color-dark)]"
            >
                <button
                    type="submit"
                    class="btn preset-filled-success-100-900 flex-1 font-medium"
                >
                    {m["actions.save"]()}
                </button>
                <button
                    onclick={() => {
                        isFullPreview = !isFullPreview;
                    }}
                    type="button"
                    class="btn preset-filled-primary-400-600"
                >
                    {m["actions.full-preview"]()}
                </button>
            </div>
            <div class="mt-2 flex h-1 min-h-15 gap-1">
                <button
                    type="button"
                    class="btn preset-filled-primary-400-600 h-full"
                    title={m["labels.share"]()}
                    onclick={async () => {
                        await navigator.share({
                            files: [await renderInvoiceShare()],
                            title: "Images",
                            text: "Beautiful images",
                        });
                    }}
                >
                    <SvgShare class="w-10 fill-white" />
                </button>
                <button
                    onclick={() => renderInvoiceFunc(true)}
                    type="button"
                    class="btn preset-filled-success-100-900 h-full flex-1"
                >
                    <SaveIcon class="fill-success-600 w-10" />
                    {m["actions.download"]()}
                </button>
            </div>
        </form>
    </div>

    <div class="pdf-viewer-wrap">
        {#if url}
            {#key url}
                <PdfViewer
                    {url}
                    showTopButton={false}
                    showButtons={["navigation"]}
                    scale={2.5}
                />
            {/key}
        {/if}
    </div>
</div>

<style lang="scss">
    .pdf-viewer-wrap {
        :global(.parent),
        :global(.control),
        :global(.control-start) {
            margin: 0;
            padding: 0;
            border-radius: 0;
            border: 0;
            height: 100%;
        }

        :global(.control-start .line) {
            position: sticky;
            top: 0;
            width: 100%;
            background-color: var(--color-surface-900);
            justify-content: start;
            padding: 5px 10px;
            gap: 15px;

            :global(.activator) {
                :global(.tooltip) {
                    display: none;
                }

                :global(.button-control) {
                    margin: 0;
                    border: 0;

                    :global(svg) {
                        fill: var(--color-primary-300);
                    }
                }
                :global(.button-control.disabled) {
                    opacity: 0.4;
                }
            }
        }
    }

    .main-wrap {
        @apply relative mt-8 mb-40 flex justify-center gap-x-3 px-2;

        .pdf-viewer-wrap {
            @apply sticky top-0 z-1 m-0 h-[100svh] w-[100%] max-w-[750px] flex-1 overflow-auto;

            :global(.control-start .line) {
                position: sticky;
                top: 0;
                background-color: var(--color-surface-900);
                justify-content: start;
                padding: 5px 10px;
                gap: 15px;

                :global(.activator) {
                    :global(.tooltip) {
                        display: none;
                    }

                    :global(.button-control) {
                        margin: 0;
                        border: 0;

                        :global(svg) {
                            fill: var(--color-primary-300);
                        }
                    }
                    :global(.button-control.disabled) {
                        opacity: 0.4;
                    }
                }
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
                margin: 0;
                @apply bg-surface-950;
            }

            :global(canvas) {
                margin: 0 auto;
                pointer-events: none;
            }
        }
    }
</style>
