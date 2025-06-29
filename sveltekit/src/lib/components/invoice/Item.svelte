<script lang="ts">
    import Trash from "@lucide/svelte/icons/trash";
    import _ from "lodash";
    import * as yup from "yup";

    import { m } from "$lib/paraglide/messages";
    import type { IItem } from "$lib/pdf/invoice-types";
    import { DefaultItem } from "$lib/pdf/invoice-types";
    import { fromCents, toCents } from "$lib/pdf/utils";
    import {
        useFormItemErrors,
        useFormKeyStore,
        useFormStore,
    } from "$lib/stores/form.svelte";
    import type { YupShape } from "$lib/types/types";
    import { createId } from "$lib/utils";
    import { extractYupErrors } from "$lib/validations/extract-errors.svelte";
    import { yupHasNumberMaxTwoDecimalValidation } from "$lib/validations/ine";

    import Button from "../form/Button.svelte";
    import Error from "../form/Error.svelte";
    import Input from "../form/Input.svelte";

    let {
        ...props
    }: {
        item: IItem;
    } = $props();

    const invoiceValuesKey = useFormKeyStore();
    let invoiceValues = $derived(
        useFormStore({
            get key() {
                return invoiceValuesKey.value.invoiceName;
            },
        }).value,
    );

    let item = $state(
        _.cloneDeep({
            ...props.item,
            singlePrice: fromCents(props.item.singlePrice),
        }),
    );

    $effect(() => {
        const differentKeys =
            DefaultItem && item
                ? _.difference(Object.keys(DefaultItem), Object.keys(item))
                : [];

        differentKeys.forEach((key) => {
            item = _.set(item, key, _.get(DefaultItem, key));
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
        <Button
            aria-label={m["actions.remove-item"]()}
            onclick={() => {
                invoiceValues.items = invoiceValues.items.filter(
                    (i) => i.id !== item.id,
                );
            }}
            title={m["actions.remove-item"]()}
            type="button"
        >
            <Trash class="stroke-error-500" />
        </Button>
    </div>
    <Input label={m["form.name"]()} bind:value={item.name} />
    <Input
        error={itemErrors.value["count"]}
        label={m["form.count"]()}
        min={0}
        type="number"
        bind:value={item.count}
    />
    <div class="grid grid-cols-[2fr_1fr] items-end gap-1">
        <Input
            error={itemErrors.value["singlePrice"]}
            isErrorVisible={false}
            label={m["form.single-price"]()}
            step="0.01"
            type="number"
            bind:value={item.singlePrice}
            bind:id={InputSinglePriceId}
        />
        <Input
            error={itemErrors.value["measurementUnit"]}
            label={m["form.measurement-unit"]()}
            bind:value={item.measurementUnit}
        />
        <Error
            id={InputSinglePriceId}
            error={itemErrors.value["singlePrice"]}
        />
    </div>
    {#if !_.isUndefined(item.vatPercentage)}
        <Input
            error={itemErrors.value["vatPercentage"]}
            label={m["form.vat-percentage"]()}
            max={100}
            min={0}
            step={0.01}
            type="number"
            bind:value={item.vatPercentage}
        />
    {/if}
</div>
