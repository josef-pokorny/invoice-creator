<script lang="ts" module>
    import type { Snippet } from "svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";

    export interface ButtonProps extends HTMLButtonAttributes {
        children: Snippet;
    }
</script>

<script lang="ts">
    let { children, ...props }: ButtonProps = $props();
</script>

<button {...props} type={props.type || "button"}>
    {@render children()}
</button>
