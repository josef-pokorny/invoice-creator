<script lang="ts">
    import { Tooltip } from "melt/builders";
    import type { Snippet } from "svelte";

    type Props = {
        trigger: Snippet<[{ builder: Tooltip["trigger"] }]>;
        children: Snippet;
    };
    let { trigger, children }: Props = $props();

    const tooltip = new Tooltip({
        forceVisible: true,
        floatingConfig: {
            computePosition: { placement: "bottom" },
        },
        openDelay: 300,
        disableHoverableContent: true,
    });
</script>

{@render trigger({ builder: tooltip.trigger })}

<div {...tooltip.content} class="melt-tooltip-container">
    <div {...tooltip.arrow} class="melt-tooltip-arrow"></div>
    <div class="content pointer-events-none select-none">
        {@render children()}
    </div>
</div>

<style lang="scss">
    [data-melt-tooltip-content] {
        border: 0;
        margin: 0;

        position: absolute;
        pointer-events: none;
        opacity: 0;

        transform: scale(0.9);

        transition: 150ms;
        transition-property: opacity, transform;
    }

    [data-melt-tooltip-content][data-open] {
        pointer-events: auto;
        opacity: 1;

        transform: scale(1);
    }

    .melt-tooltip-container {
        padding: 0;
        background-color: transparent;

        .melt-tooltip-arrow {
            background-color: var(--color-surface-700) !important;
            width: 0.5rem;
            height: 0.5rem;
            border-top-left-radius: 0.25rem;
        }

        .content {
            padding-left: 16px;
            padding-right: 16px;
            padding-top: 6px;
            padding-bottom: 6px;
            border-radius: 0.75rem;

            background-color: var(--color-surface-700);
            box-shadow:
                0 10px 15px -3px rgba(0, 0, 0, 0.1),
                0 4px 6px -4px rgba(0, 0, 0, 0.1);
            color: var(--color-accent);
        }
    }
</style>
