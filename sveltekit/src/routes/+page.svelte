<script lang="ts">
    import { renderInvoice } from "$lib";
    import Crawl from "$lib/components/crawl.svelte";
    import PdfViewer from "svelte-pdf";
    import Input from "$lib/components/form/Input.svelte";
    import { onMount } from "svelte";
    import { useFormStore } from "$lib/stores/form";
    import { m } from "$lib/paraglide/messages";
    import moment from "$lib/moment";
    import Item from "$lib/components/form/Item.svelte";
    import SvgPlusCircle from "$lib/svgs/svg-plus-circle.svelte";
    import _ from "lodash";
    import Switch from "$lib/components/form/Switch.svelte";
    import Datepicker from "$lib/components/form/Datepicker.svelte";
    import { DefaultItem, EInvoiceType } from "$lib/pdf/invoice-types";
    import Select from "$lib/components/form/Select.svelte";
    import { fade } from "svelte/transition";
    import { SaveIcon, X } from "@lucide/svelte";

    let url: string | null = $state(null);

    const invoiceData = useFormStore().value;

    const renderInvoiceFunc = (download?: boolean) =>
        renderInvoice({
            invoiceProps: {
                invoiceData: {
                    ...invoiceData,
                    items: invoiceData.items.map((i) => ({
                        ...i,
                        singlePrice: i.singlePrice * 100,
                    })),
                },
            },
            download,
        });

    function renderPDF() {
        renderInvoiceFunc().then((d) => {
            if (url) window.URL.revokeObjectURL(url);
            url = d;
        });
    }

    let isMounted = false;
    let timeoutId: number;
    $effect(() => {
        ({
            ...invoiceData,
            ...invoiceData.items,
            ...invoiceData.billing,
            ...invoiceData.supplierBilling,
        });

        if (isMounted) {
            timeoutId = setTimeout(() => {
                renderPDF();
            }, 1000);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    });

    onMount(() => {
        renderPDF();
        isMounted = true;
    });

    let issuedAtDate = $derived(
        invoiceData.issuedAt ? new Date(invoiceData.issuedAt) : undefined,
    );
    let paidAtDate = $derived(
        invoiceData.paidAt ? new Date(invoiceData.paidAt) : undefined,
    );
    let pickedUpAtDate = $derived(
        invoiceData.pickedUpAt ? new Date(invoiceData.pickedUpAt) : undefined,
    );
    let paymentDueDate = $derived(
        invoiceData.paymentDueDate
            ? new Date(invoiceData.paymentDueDate)
            : undefined,
    );

    $effect(() => {
        invoiceData.issuedAt = issuedAtDate ? issuedAtDate.toISOString() : "";
        invoiceData.paidAt = paidAtDate ? paidAtDate.toISOString() : "";
        invoiceData.pickedUpAt = pickedUpAtDate
            ? pickedUpAtDate.toISOString()
            : "";
        invoiceData.paymentDueDate = paymentDueDate
            ? paymentDueDate.toISOString()
            : "";
    });

    let fullPreview = $state(false);

    $effect(() => {
        document.body.style.overflow = fullPreview ? "hidden" : "";
    });
</script>

<Crawl />

{#if fullPreview}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        transition:fade={{ duration: 120 }}
        class="pdf-full-preview fixed top-0 right-0 z-10 h-[100vh] w-[100vw]"
    >
        <div class="relative h-[100%]">
            <button
                onclick={() => {
                    fullPreview = false;
                }}
                type="button"
                class="btn absolute top-0 left-0"
            >
                <X class="stroke-error-600 h-[64px] w-[64px]" />
            </button>
            <div class="pdf-viewer-wrap h-[100%] overflow-auto">
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
    </div>
{/if}

<div class="main-wrap relative mb-40 flex justify-center gap-x-3 px-2">
    <form
        class="relative m-0 mt-5 mb-15 flex w-full max-w-[420px] shrink-0 flex-col gap-2"
        onsubmit={(e) => {
            e.preventDefault();
            renderPDF();
        }}
    >
        <h2 class="h3 text-center">{m["labels.invoice"]()}</h2>

        <h3 class="h5 font-bold uppercase">{m["form.general"]()}</h3>
        <Select bind:value={invoiceData.invoiceType}>
            {#snippet options()}
                {#each Object.values(EInvoiceType) as invoiceType (invoiceType)}
                    <option value={invoiceType}>
                        {m[`form.${invoiceType}`]()}
                    </option>
                {/each}
            {/snippet}
        </Select>
        <Input
            bind:value={invoiceData.companyName}
            label={m["form.company"]()}
        />
        <Input bind:value={invoiceData.refId} label={m["form.refid"]()} />
        <Input bind:value={invoiceData.currency} label={m["form.currency"]()} />
        <Datepicker
            label={m["form.issued-at"]()}
            type="date"
            bind:value={issuedAtDate}
        />
        <Datepicker
            label={m["form.paid-at"]()}
            type="date"
            bind:value={paidAtDate}
        />
        <Datepicker
            label={m["form.pickup-at"]()}
            type="date"
            bind:value={pickedUpAtDate}
        />
        <Datepicker
            label={m["form.payment-due"]()}
            type="date"
            bind:value={paymentDueDate}
        />

        <hr class="hr mx-7 my-4 w-[auto]" />

        <h3 class="h5 font-bold uppercase">{m["form.supplier"]()}</h3>
        <Input
            bind:value={invoiceData.supplierBilling.fullname}
            label={m["form.fullname"]()}
        />
        <Input
            bind:value={invoiceData.supplierBilling.line1}
            label={m["form.address"]()}
        />
        <Input
            bind:value={invoiceData.supplierBilling.postal}
            label={m["form.postal"]()}
        />
        <Input
            bind:value={invoiceData.supplierBilling.city}
            label={m["form.city"]()}
        />
        <Input
            bind:value={invoiceData.supplierBilling.country}
            label={m["form.country"]()}
        />
        <Input
            bind:value={invoiceData.supplierBilling.ine}
            label={m["form.ine"]()}
        />
        <Input
            bind:value={invoiceData.supplierBilling.vat}
            label={m["form.vat"]()}
        />

        <Switch
            bind:checked={invoiceData.isSupplierSelfEmployed}
            label={m["form.iam-selfemployed"]()}
        />

        {#if !invoiceData.isSupplierSelfEmployed}
            <Input
                bind:value={invoiceData.customTextUnderSupplier}
                label={m["form.custom-text-under-supplier"]()}
                type="textarea"
            />
        {/if}

        <hr class="hr mx-7 my-4 w-[auto]" />

        <h3 class="h5 font-bold uppercase">{m["form.receiver"]()}</h3>
        <Input
            bind:value={invoiceData.billing.fullname}
            label={m["form.fullname"]()}
        />
        <Input
            bind:value={invoiceData.billing.line1}
            label={m["form.address"]()}
        />
        <Input
            bind:value={invoiceData.billing.postal}
            label={m["form.postal"]()}
        />
        <Input bind:value={invoiceData.billing.city} label={m["form.city"]()} />
        <Input
            bind:value={invoiceData.billing.country}
            label={m["form.country"]()}
        />
        <Input bind:value={invoiceData.billing.ine} label={m["form.ine"]()} />
        <Input bind:value={invoiceData.billing.vat} label={m["form.vat"]()} />

        <hr class="hr mx-7 my-4 w-[auto]" />

        <h3 class="h5 font-bold uppercase">{m["form.items"]()}</h3>
        <Switch
            bind:checked={invoiceData.countVat}
            label={m["form.count-vat"]()}
        />
        <Switch
            bind:checked={invoiceData.roundTotal}
            label={m["form.round-total"]()}
        />

        {#each invoiceData.items as item (item.id)}
            <Item {item} />
        {/each}

        <div>
            <button
                onclick={() => {
                    invoiceData.items.push(
                        _.cloneDeep({
                            ...DefaultItem,
                            id:
                                _.uniqueId("item_") +
                                Math.random() +
                                Math.random(),
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

        <hr class="hr mx-7 my-4 w-[auto]" />

        <Input
            bind:value={invoiceData.paymentType}
            label={m["form.payment-type"]()}
        />
        <Input
            bind:value={invoiceData.paymentInfo}
            label={m["form.payment-info"]()}
            type="textarea"
            class="min-h-[8rem]"
        />

        <hr class="hr mx-7 my-4 w-[auto]" />

        <Input
            bind:value={invoiceData.customFooterText}
            label={m["form.custom-footer-text"]()}
            type="textarea"
        />

        <hr class="hr mx-7 my-4 w-[auto]" />

        <div class="sticky bottom-0 flex min-h-15 gap-1">
            <button
                type="submit"
                class="btn preset-filled-success-100-900 flex-1 font-medium"
            >
                {m["actions.save"]()}
            </button>
            <button
                onclick={() => {
                    fullPreview = !fullPreview;
                }}
                type="button"
                class="btn preset-filled-primary-400-600"
            >
                {m["actions.full-preview"]()}
            </button>
        </div>
        <button
            onclick={() => renderInvoiceFunc(true)}
            type="button"
            class="btn btn-group preset-filled-success-100-900 mt-2"
        >
            <SaveIcon class="fill-success-600 w-10" />
            {m["actions.download"]()}
        </button>
    </form>
    <div
        class="pdf-viewer-wrap sticky top-0 z-1 m-0 h-[100svh] w-[100%] max-w-[750px] flex-1 overflow-auto"
    >
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
    .pdf-full-preview {
        background-color: rgba(0, 0, 0, 0.555);

        :global(.parent) {
            margin: auto !important;
        }
    }

    .main-wrap {
        @media (max-width: 900px) {
            flex-direction: column;
            align-items: center;
        }
    }

    .pdf-viewer-wrap {
        :global(.parent),
        :global(.control) {
            margin: 0;
            padding: 0;
            border-radius: 0;
        }

        :global(.viewer) {
            border: 0;
        }

        :global(.parent) {
            width: 100% !important;
            overflow: hidden;
            min-width: 650px;
            max-width: 720px;

            :global(canvas) {
                width: 100% !important;
            }
        }
    }
</style>
