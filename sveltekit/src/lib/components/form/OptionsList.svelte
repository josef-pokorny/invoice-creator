<script lang="ts" module>
    import _ from "lodash";
    import type { Combobox, Select } from "melt/builders";
    import { twMerge } from "tailwind-merge";

    import { m } from "$lib/paraglide/messages";

    export interface Option<T> {
        value: T;
        label: string;
    }

    export interface IListProps<T> {
        options: Option<T>[];
        builder?: Select<T, boolean> | Combobox<T, boolean>;
    }
</script>

<script lang="ts" generics="T">
    let { builder, options }: IListProps<T> = $props();
</script>

<div class="list-container" {...builder?.content}>
    {#each options as option}
        <div
            class={twMerge(
                "list-option",
                _.isEqual(builder?.value, option.value) &&
                    "list-option-selected",
                _.isEqual(builder?.highlighted, option.value) &&
                    "list-option-highlighted",
            )}
            {...builder?.getOption(option.value, option.label)}
        >
            {option.label}
        </div>
    {:else}
        <div class="p-2">
            {m["text.no-results"]()}
        </div>
    {/each}
</div>

<style lang="scss">
    .list-container {
        @include shadow-all;
        border: 1px solid var(--color-surface-800);
        border-radius: var(--radius-base);
    }

    .list-option {
        padding: calc(var(--spacing) * 1.5);
        user-select: none;

        &:hover {
            cursor: pointer;
        }
    }

    .list-option-highlighted {
        background-color: var(--color-surface-800);
    }

    .list-option-selected {
        background-color: var(--color-primary-600);
        font-weight: 600;
    }
</style>
