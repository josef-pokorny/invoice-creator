<script lang="ts">
    import Toggle from "flowbite-svelte/Toggle.svelte";
    import type { ComponentProps } from "svelte";
    import type { ClassValue } from "svelte/elements";

    import { createId } from "$lib/utils";

    interface IProps extends ComponentProps<typeof Toggle> {
        label?: string;
        classContainer?: ClassValue;
    }

    let {
        label,
        checked = $bindable(false),
        id = createId(),
        classContainer,
        ...rest
    }: IProps = $props();
</script>

<fieldset class="flex flex-row items-center">
    <Toggle {id} {...rest} bind:checked />
    {#if label}
        <label for={id}>{label}</label>
    {/if}
</fieldset>
