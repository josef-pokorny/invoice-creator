<script lang="ts">
    import { createId } from "$lib/utils";
    import type { Snippet } from "svelte";
    import type { HTMLSelectAttributes } from "svelte/elements";

    interface IProps extends HTMLSelectAttributes {
        label?: string;
        options: Snippet;
    }

    let {
        label,
        value = $bindable(),
        options,
        id = createId(),
        ...rest
    }: IProps = $props();
</script>

<fieldset class="label">
    {#if label}
        <label for={id} class="label-text text-surface-100 text-[0.9rem]">
            {label}
        </label>
    {/if}
    <select {id} bind:value {...rest} class="select {rest.class}">
        {@render options()}
    </select>
</fieldset>
