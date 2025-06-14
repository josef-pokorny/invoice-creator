<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLSelectAttributes } from "svelte/elements";

    import { createId } from "$lib/utils";

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
        <label class="label-text text-surface-100 text-[0.9rem]" for={id}>
            {label}
        </label>
    {/if}
    <select {id} bind:value {...rest} class="select {rest.class}">
        {@render options()}
    </select>
</fieldset>
