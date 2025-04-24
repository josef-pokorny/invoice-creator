<script lang="ts" module>
    type ToastData = {
        title?: Snippet | string;
        description: Snippet | string;
        variant?: "success" | "warning" | "error";
    };

    const toaster = new Toaster<ToastData>();

    export const addToast = (args: Parameters<typeof toaster.addToast>[0]) => {
        if (isString(args.data.description) && args.closeDelay) {
            args.closeDelay =
                args.closeDelay + args.data.description.length * 30;
        }
        if (isString(args.data.title) && args.closeDelay) {
            args.closeDelay = args.closeDelay + args.data.title.length * 30;
        }

        toaster.addToast(args);
    };
</script>

<script lang="ts">
    import { isFunction, isString } from "lodash-es";

    import { Toaster } from "melt/builders";
    import { Progress } from "melt/components";
    import type { Snippet } from "svelte";
    import { fly } from "svelte/transition";
</script>

<div
    {...toaster.root}
    class="fixed !right-0 !bottom-4 flex w-[100%] max-w-[400px] flex-col"
    style:--toasts={toaster.toasts.length}
>
    {#each toaster.toasts as toast, i (toast.id)}
        {@const variant = toast.data.variant || "error"};

        <div
            class="{variant === 'success'
                ? 'preset-filled-success-500'
                : variant === 'warning'
                  ? 'bg-warning-400 text-warning-contrast-500'
                  : variant === 'error'
                    ? 'bg-error-500 text-error-contrast-500'
                    : ''} relative flex h-[--toast-height] w-full flex-col justify-center rounded-xl px-4 text-left transition"
            {...toast.content}
            style:--n={toaster.toasts.length - i}
            in:fly={{ y: 60, opacity: 0.9 }}
            out:fly={{ y: 20 }}
        >
            {#if isFunction(toast.data.title)}
                {@render toast.data.title()}
            {:else if toast.data.title}
                <h3 {...toast.title} class="text-[1.1rem] font-medium">
                    {toast.data.title}
                </h3>
            {/if}

            {#if toast.data.description}
                <div
                    {...toast.description}
                    class={variant === "error" ? "font-medium" : ""}
                >
                    {#if isFunction(toast.data.description)}
                        {@render toast.data.description()}
                    {:else}
                        {toast.data.description}
                    {/if}
                </div>
            {/if}

            <button {...toast.close} aria-label="dismiss toast" class="cross">
                X
            </button>

            {#if toast.closeDelay !== 0}
                <div
                    class="absolute top-2 right-8 h-[4px] w-[30px] overflow-hidden rounded-full"
                >
                    <Progress value={toast.percentage}>
                        {#snippet children(progress)}
                            <div
                                {...progress.root}
                                class="relative h-full w-full overflow-hidden bg-gray-200 dark:bg-gray-950"
                            >
                                <div
                                    {...progress.progress}
                                    class="h-full w-full -translate-x-[var(--progress)] bg-white"
                                ></div>
                            </div>
                        {/snippet}
                    </Progress>
                </div>
            {/if}
        </div>
    {/each}
</div>

<style lang="scss">
    :global([popover]) {
        inset: unset;
    }

    .cross {
        @apply absolute top-[50%] right-2 translate-y-[-50%] bg-transparent font-semibold;

        color: var(--color-surface-150);

        &:hover {
            color: var(--color-surface-50);
            text-shadow: 0 0 10px var(--color-surface-50);
        }
    }

    [data-melt-toaster-root] {
        --gap: 5px;
        --hover-offset: 0px;
        --toast-height: 4rem;
        --hidden-offset: 15px;

        --hidden-toasts: calc(var(--toasts) - 1);

        overflow: visible;
        display: grid;
        grid-template-rows: var(--toast-height) repeat(
                var(--hidden-toasts),
                var(--hidden-offset)
            );
        grid-template-columns: 1fr;
        gap: 0;
        background: unset;
        padding: 0;
    }

    [data-melt-toaster-root]:hover {
        grid-template-rows: var(--hidden-offset) var(--toast-height) repeat(
                var(--hidden-toasts),
                calc(var(--toast-height) + var(--gap))
            );
    }

    [data-melt-toaster-toast-content] {
        width: 95%;
        right: 2.5%;

        position: absolute;
        pointer-events: auto;
        bottom: 0;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        padding: 12px 20px 12px 12px;
        outline: none;

        transform-origin: 50% 0%;
        transition: all 350ms ease;
    }

    :global([data-theme="dark"] [data-melt-toaster-toast-content]) {
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
    }

    [data-melt-toaster-toast-content]:nth-last-child(n + 4) {
        z-index: 1;
        scale: 0.925;
        opacity: 0;
        translate: 0 calc(-3 * var(--hidden-offset));
    }

    [data-melt-toaster-toast-content]:nth-last-child(-n + 3) {
        z-index: 2;
        scale: 0.95;
        translate: 0 calc(-2 * var(--hidden-offset));
    }

    [data-melt-toaster-toast-content]:nth-last-child(-n + 2) {
        z-index: 3;
        scale: 0.975;
        translate: 0 calc(-1 * var(--hidden-offset));
    }

    [data-melt-toaster-toast-content]:nth-last-child(-n + 1) {
        z-index: 4;
        scale: 1;
        translate: 0;
    }

    [data-melt-toaster-root]:hover [data-melt-toaster-toast-content] {
        scale: 1;
        opacity: 1;
        --toast-gap: calc(calc(var(--gap) * var(--n)) + var(--hover-offset));
        --percentage: calc(-100% * calc(var(--n) - 1));
        translate: 0 calc(var(--percentage) - var(--toast-gap));
    }
</style>
