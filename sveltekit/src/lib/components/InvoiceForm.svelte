<script lang="ts">
    import Input from "$lib/components/form/Input.svelte";
    import Item from "$lib/components/form/Item.svelte";
    import SvgPlusCircle from "$lib/svgs/svg-plus-circle.svelte";
    import Switch from "$lib/components/form/Switch.svelte";
    import Datepicker from "$lib/components/form/Datepicker.svelte";
    import { DefaultItem, EInvoiceType } from "$lib/pdf/invoice-types";
    import Select from "$lib/components/form/Select.svelte";
    import { SaveIcon } from "@lucide/svelte";
    import ButtonRequestAres from "$lib/components/ButtonRequestAres.svelte";
    import Message from "$lib/components/Message.svelte";
    import { cloneDeep } from "lodash-es";
    import { createId } from "$lib/utils";
    import {
        useFormErrorsStore,
        useFormKeyStore,
        useFormStore,
    } from "$lib/stores/form.svelte";
    import { m } from "$lib/paraglide/messages";

    let {
        renderPDF,
        renderInvoiceFunc,
        isFullPreview = $bindable(),
    }: {
        renderPDF: (arg0: boolean) => void;
        renderInvoiceFunc: (arg0: boolean) => void;
        isFullPreview: boolean;
    } = $props();

    const invoiceValuesKey = useFormKeyStore();
    let invoiceValues = $derived(
        useFormStore({
            get key() {
                return invoiceValuesKey.value.profileName;
            },
        }).value,
    );
    let invoiceValuesErrors = useFormErrorsStore();

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
</script>

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
    <Input bind:value={invoiceValues.companyName} label={m["form.company"]()} />
    <Input bind:value={invoiceValues.refId} label={m["form.refid"]()} />
    <Input bind:value={invoiceValues.currency} label={m["form.currency"]()} />
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
    <Input bind:value={invoiceValues.billing.vat} label={m["form.vat"]()} />

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
