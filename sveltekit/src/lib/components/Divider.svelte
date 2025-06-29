<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";
    import { type ClassNameValue, twMerge } from "tailwind-merge";

    interface IDividerProps
        extends Omit<HTMLAttributes<HTMLDivElement>, "class"> {
        class?: ClassNameValue;
        direction?: "x" | "y";
        isInFlex?: boolean;
    }

    let { direction = "x", isInFlex, ...props }: IDividerProps = $props();
</script>

<div
    {...props}
    class={twMerge(
        "border-surface-700 w-0 ",
        isInFlex ? "self-stretch" : direction === "x" ? "w-full" : "h-full",
        direction === "x" ? "my-3 border-t-1" : "mx-3 border-l-1",
        props.class,
    )}
    role="separator"
></div>
