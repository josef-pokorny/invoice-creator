<script lang="ts" module>
    import type { Snippet } from "svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";
    import { type ClassNameValue, twMerge } from "tailwind-merge";

    import { createId } from "$lib/utils";

    import Spinner from "../Spinner.svelte";

    export interface ButtonProps extends Omit<HTMLButtonAttributes, "class"> {
        children: Snippet;
        class?: ClassNameValue;
        buttonClass?: ClassNameValue;
        isLoading?: boolean;
    }
</script>

<script lang="ts">
    let {
        children,
        isLoading,
        buttonClass: buttonClass,
        ...props
    }: ButtonProps = $props();

    let ariaId = createId("aria");
</script>

<button
    {...props}
    type={props.type || "button"}
    aria-busy={props["aria-busy"] || isLoading ? "true" : "false"}
    disabled={props.disabled || isLoading}
    class={twMerge("relative", props.class)}
    aria-describedby={isLoading ? ariaId : undefined}
>
    {#if isLoading}
        <Spinner isAbosuluteCenter width="25px" thickness="4px" {ariaId} />
    {/if}
    {@render children()}
</button>
