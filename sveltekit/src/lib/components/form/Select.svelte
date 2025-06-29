<script lang="ts" module>
    export interface ISelectProps<T>
        extends Partial<SvelteComponent<SelectProps<T, true>>> {
        options: { value: T; label: string }[];
        label?: string;
    }
</script>

<script lang="ts" generics="T">
    import { Select, type SelectProps } from "melt/builders";
    import {} from "melt/components";
    import type { SvelteComponent } from "svelte";
    import { twMerge } from "tailwind-merge";

    import Label from "./Label.svelte";
    import type { IOption } from "./OptionsList.svelte";
    import OptionsList from "./OptionsList.svelte";

    let {
        options,
        label,
        value = $bindable(),
        open = $bindable(),
        ...props
    }: ISelectProps<T> = $props();

    const select = new Select<IOption<T>["value"]>({
        ...props,
        value: () => value,
        onValueChange(v) {
            value = v;
        },
        open: () => open,
        onOpenChange(opened) {
            open = opened;
        },
    });
</script>

<div class={twMerge(props.class, "label")}>
    {#if label}
        <Label for={select.ids.trigger} {label} />
    {/if}

    <button class="input w-full text-left" {...select.trigger}>
        {select.value ? select.getOptionLabel(select.value) : ""}
    </button>
</div>

<OptionsList {options} builder={select} />
