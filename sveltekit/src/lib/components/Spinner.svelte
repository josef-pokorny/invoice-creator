<script lang="ts" module>
    import type { HTMLAttributes } from "svelte/elements";

    export interface ISpinnerProps
        extends Omit<HTMLAttributes<HTMLSpanElement>, "class"> {
        class?: ClassNameValue;
        ariaId?: string;
        isAbosuluteCenter?: boolean;
        thickness?: string;
        width?: string;
    }
</script>

<script lang="ts">
    import { type ClassNameValue, twMerge } from "tailwind-merge";

    let {
        ariaId,
        isAbosuluteCenter,
        thickness,
        width,
        ...props
    }: ISpinnerProps = $props();
</script>

<div role="status">
    <span
        {...props}
        aria-hidden="true"
        class={twMerge(
            "loader border-solid border-surface-50",
            isAbosuluteCenter
                ? "absolute bottom-1/2 right-1/2 translate-1/2"
                : "",
            props.class,
        )}
        style:--thickness={thickness || "5px"}
        style:--width={width || "48px"}
    ></span>
    <span class="sr-only" id={ariaId}>Loading...</span>
</div>

<style lang="scss">
    .loader {
        width: var(--width);
        height: var(--width);
        border-width: var(--thickness);
        border-bottom-color: transparent;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
