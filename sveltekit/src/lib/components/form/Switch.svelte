<script lang="ts">
    import _ from "lodash";
    import type { ComponentProps } from "svelte";
    import { Toggle } from "flowbite-svelte";

    interface IProps extends ComponentProps<typeof Toggle> {
        label?: string;
    }

    let {
        label,
        checked = $bindable(false),
        id = _.uniqueId("switch_") + Math.random() + Math.random(),
        ...rest
    }: IProps = $props();
</script>

<fieldset class="flex flex-row items-center">
    <Toggle {id} {...rest} bind:checked />
    {#if label}
        <label for={id}>{label}</label>
    {/if}
</fieldset>
