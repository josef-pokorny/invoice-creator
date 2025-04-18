<script lang="ts">
    import PdfViewer from "svelte-pdf";
    import Input from "$lib/components/form/Input.svelte";
    import { onMount } from "svelte";
    import {
        useFormErrorsStore,
        useFormKeyStore,
        useFormStore,
    } from "$lib/stores/form.svelte";
    import { m } from "$lib/paraglide/messages";
    import Item from "$lib/components/form/Item.svelte";
    import SvgPlusCircle from "$lib/svgs/svg-plus-circle.svelte";
    import _ from "lodash";
    import Switch from "$lib/components/form/Switch.svelte";
    import Datepicker from "$lib/components/form/Datepicker.svelte";
    import {
        DefaultItem,
        EInvoiceType,
        type IInvoiceValues,
    } from "$lib/pdf/invoice-types";
    import Select from "$lib/components/form/Select.svelte";
    import { fade } from "svelte/transition";
    import { SaveIcon, X } from "@lucide/svelte";
    import * as yup from "yup";
    import { yupBillingValidation } from "$lib/validations/invoice";
    import { createInvoiceData, renderInvoiceBlobUrl } from "$lib/pdf/utils";
    import type { NestedKeyOf, YupShape } from "$lib/types/types";
    import ButtonRequestAres from "$lib/components/ButtonRequestAres.svelte";
    import { extractYupErrors } from "$lib/validations/extract-errors.svelte";
    import Message from "$lib/components/Message.svelte";

    // region:    --- Form validation

    const schema = yup.object().shape<YupShape<Partial<IInvoiceValues>>>({
        issuedAt: yup
            .string()
            .required(m["errors.this-field-is-recommended"]()),
        paymentDueDate: yup
            .string()
            .when(
                ["paymentInfo", "paymentType"] as NestedKeyOf<IInvoiceValues>[],
                (values, schema) => {
                    const [paymentInfo, paymentType]: [
                        IInvoiceValues["paymentInfo"],
                        IInvoiceValues["paymentType"],
                    ] = values as any;

                    if (paymentInfo?.length || paymentType?.length) {
                        return yup
                            .string()
                            .required(m["errors.this-field-is-recommended"]());
                    } else {
                        return schema;
                    }
                },
            ),
        billing: yupBillingValidation,
        supplierBilling: yupBillingValidation,
    });

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

    let invoiceValuesErrors = useFormErrorsStore();

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

        schema
            .validate(invoiceValues, { abortEarly: false })
            .then(() => {
                invoiceValuesErrors.reset();
            })
            .catch((e: yup.ValidationError) => {
                requestAnimationFrame(() => {
                    invoiceValuesErrors.reset();

                    extractYupErrors(e, invoiceValuesErrors.value);
                });
            });

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

    let isFullPreview = $state(false);

    $effect(() => {
        document.body.style.overflow = isFullPreview ? "hidden" : "";
    });
</script>

{#if isFullPreview}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        transition:fade={{ duration: 120 }}
        class="pdf-full-preview fixed top-0 right-0 z-10 h-[100vh] w-[100vw]"
    >
        <div class="relative h-[100%]">
            <button
                onclick={() => {
                    isFullPreview = false;
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

<div
    class="main-wrap relative mt-8 mb-40 flex justify-center gap-x-3 px-2"
    aria-hidden={isFullPreview}
>
    <div class="w-full max-w-[370px] shrink-0">
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
            />

            <hr class="hr mx-7 my-5 w-[auto]" />

            <div class="sticky bottom-0 flex min-h-15 gap-1">
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
            <button
                onclick={() => renderInvoiceFunc(true)}
                type="button"
                class="btn btn-group preset-filled-success-100-900 mt-2"
            >
                <SaveIcon class="fill-success-600 w-10" />
                {m["actions.download"]()}
            </button>
        </form>
    </div>

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
        @media (max-width: 850px) {
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
