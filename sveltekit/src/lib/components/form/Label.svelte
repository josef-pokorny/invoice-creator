<script lang="ts">
    import type { HTMLLabelAttributes } from "svelte/elements";

    let { label, ...rest }: { label: string } & HTMLLabelAttributes = $props();
</script>

<label {...rest} class="label-text text-surface-100 text-[0.9rem] {rest.class}">
    {label}
</label>
