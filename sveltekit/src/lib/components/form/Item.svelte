<script lang="ts">
    import { DefaultItem } from "$lib/pdf/invoice-types";
    import { m } from "$lib/paraglide/messages";
    import type { IItem } from "$lib/pdf/invoice-types";
    import {
        useFormItemErrors,
        useFormKeyStore,
        useFormStore,
    } from "$lib/stores/form.svelte";
    import { Trash } from "@lucide/svelte";
    import Input from "./Input.svelte";
    import { cloneDeep, difference, get, isUndefined, set } from "lodash-es";
    import * as yup from "yup";
    import type { YupShape } from "$lib/types/types";
    import { yupHasNumberMaxTwoDecimalValidation } from "$lib/validations/ine";
    import { extractYupErrors } from "$lib/validations/extract-errors.svelte";
    import { createId } from "$lib/utils";
    import Error from "./Error.svelte";
    import { fromCents, toCents } from "$lib/pdf/utils";

    let {
        ...props
    }: {
        item: IItem;
    } = $props();

    const invoiceValuesKey = useFormKeyStore();
    let invoiceValues = $derived(
        useFormStore({
            get key() {
                return invoiceValuesKey.value.profileName;
            },
        }).value,
    );

    let item = $state(
        cloneDeep({
            ...props.item,
            singlePrice: fromCents(props.item.singlePrice),
        }),
    );

    $effect(() => {
        const differentKeys =
            DefaultItem && item
                ? difference(Object.keys(DefaultItem), Object.keys(item))
                : [];

        differentKeys.forEach((key) => {
            item = set(item, key, get(DefaultItem, key));
        });
    });

    const itemErrors = useFormItemErrors();

    const schema = yup.object().shape<YupShape<Partial<IItem>>>({
        singlePrice: yupHasNumberMaxTwoDecimalValidation as any,
    });

    $effect(() => {
        ({ ...item });

        schema
            .validate(item, { abortEarly: false })
            .then(() => {
                itemErrors.reset();
            })
            .catch((e: yup.ValidationError) => {
                requestAnimationFrame(() => {
                    itemErrors.reset();

                    extractYupErrors(e, itemErrors.value);
                });
            });

        requestAnimationFrame(() => {
            invoiceValues.items = invoiceValues.items.map((i) => {
                if (i.id === item.id) {
                    return { ...item, singlePrice: toCents(item.singlePrice) };
                } else {
                    return i;
                }
            });
        });
    });

    let InputSinglePriceId = $state(createId());
</script>

<div class="border-surface-500 flex flex-col gap-2 rounded-[10px] border-1 p-3">
    <div class="flex justify-end">
        <button
            aria-label={m["actions.remove-item"]()}
            title={m["actions.remove-item"]()}
            type="button"
            onclick={() => {
                invoiceValues.items = invoiceValues.items.filter(
                    (i) => i.id !== item.id,
                );
            }}
        >
            <Trash class="stroke-error-500" />
        </button>
    </div>
    <Input bind:value={item.name} label={m["form.name"]()} />
    <Input
        bind:value={item.count}
        label={m["form.count"]()}
        type="number"
        min={0}
        error={itemErrors.value["count"]}
    />
    <div class="grid grid-cols-[2fr_1fr] items-end gap-1">
        <Input
            bind:value={item.singlePrice}
            label={m["form.single-price"]()}
            type="number"
            step="0.01"
            bind:id={InputSinglePriceId}
            error={itemErrors.value["singlePrice"]}
            isErrorVisible={false}
        />
        <Input
            bind:value={item.measurementUnit}
            label={m["form.measurement-unit"]()}
            error={itemErrors.value["measurementUnit"]}
        />
        <Error
            id={InputSinglePriceId}
            error={itemErrors.value["singlePrice"]}
        />
    </div>
    {#if !isUndefined(item.vatPercentage)}
        <Input
            bind:value={item.vatPercentage}
            label={m["form.vat-percentage"]()}
            type="number"
            min={0}
            max={100}
            step={0.01}
            error={itemErrors.value["vatPercentage"]}
        />
    {/if}
</div>

<style lang="scss"></style>
