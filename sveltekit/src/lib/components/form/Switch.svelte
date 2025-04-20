<script lang="ts">
    import type { ComponentProps } from "svelte";
    import Toggle from "flowbite-svelte/Toggle.svelte";
    import { createId } from "$lib/utils";

    interface IProps extends ComponentProps<typeof Toggle> {
        label?: string;
    }

    let {
        label,
        checked = $bindable(false),
        id = createId(),
        ...rest
    }: IProps = $props();
</script>

<fieldset class="flex flex-row items-center">
    <Toggle {id} {...rest} bind:checked />
    {#if label}
        <label for={id}>{label}</label>
    {/if}
</fieldset>
