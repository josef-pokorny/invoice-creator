<script lang="ts" module>
    export interface IComboboxProps<T>
        extends Partial<ComboboxProps<T, false>> {
        options: Option<T>[];
        label?: string;
        class?: ClassNameValue;
        value?: T;
        inputValue?: string;
        open?: boolean;
        nullable?: boolean;
        nullValue?: T;
        onNull?: () => void;
    }
</script>

<script lang="ts" generics="T">
    import X from "@lucide/svelte/icons/x";
    import _ from "lodash";
    import { Combobox, type ComboboxProps } from "melt/builders";
    import { type ClassNameValue, twMerge } from "tailwind-merge";

    import { m } from "$lib/paraglide/messages";
    import { normalizeStringForSearch } from "$lib/utils";

    import Tooltip from "../Tooltip.svelte";
    import Button from "./Button.svelte";
    import Label from "./Label.svelte";
    import type { Option } from "./OptionsList.svelte";
    import OptionsList from "./OptionsList.svelte";

    let {
        options,
        label,
        value = $bindable(),
        open = $bindable(),
        inputValue = $bindable(""),
        nullable,
        nullValue,
        ...props
    }: IComboboxProps<T> = $props();

    const combobox = new Combobox<Option<T>["value"]>({
        ...props,
        value: () => value,
        onValueChange(v) {
            value = v;
        },
        inputValue: () => inputValue,
        onInputValueChange(v: string) {
            inputValue = v;
        },
        open: () => open,
        onOpenChange(opened) {
            open = opened;

            if (!opened && value) {
                inputValue = combobox.getOptionLabel(value);
            }
        },
    });

    let filteredOptions = $derived.by(() => {
        if (!combobox.touched) return options;

        const normalizeSearch = normalizeStringForSearch(combobox.inputValue);

        return _.isEmpty(normalizeSearch)
            ? options
            : options.filter(
                  (o) =>
                      normalizeStringForSearch(o.label).includes(
                          normalizeSearch,
                      ) ||
                      (_.isString(o.value) &&
                          normalizeStringForSearch(o.value).includes(
                              normalizeSearch,
                          )),
              );
    });

    function onNull() {
        props.onNull?.();

        value = nullValue;
    }

    $effect(() => {
        if (value) {
            inputValue = combobox.getOptionLabel(value);
        } else {
            inputValue = "";
        }
    });
</script>

<div class={twMerge(props.class, "label")}>
    {#if label}
        <Label for={combobox.ids.input} {label} />
    {/if}

    <div class="flex">
        <input class="input w-full text-left" {...combobox.input} />

        {#if nullable && combobox.value}
            <Tooltip>
                {#snippet trigger({ builder })}
                    <Button onclick={onNull} {...builder}>
                        <X />
                    </Button>
                {/snippet}
                {#snippet children()}
                    {m["actions.delete"]()}
                {/snippet}
            </Tooltip>
        {/if}
    </div>
</div>

<OptionsList options={filteredOptions} builder={combobox} />
