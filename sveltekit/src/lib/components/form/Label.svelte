<script lang="ts">
    import type { HTMLLabelAttributes } from "svelte/elements";
    import { type ClassNameValue, twMerge } from "tailwind-merge";

    let {
        label,
        ...rest
    }: { label: string; class?: ClassNameValue } & HTMLLabelAttributes =
        $props();
</script>

<label
    {...rest}
    class={twMerge("label-text text-surface-100 text-[0.9rem]", rest.class)}
>
    {label}
</label>
