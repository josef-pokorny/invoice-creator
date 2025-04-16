<script lang="ts">
    import { Datepicker } from "flowbite-svelte";
    import _ from "lodash";
    import type { ComponentProps } from "svelte";
    import type {
        HTMLInputAttributes,
        HTMLTextareaAttributes,
    } from "svelte/elements";
    import Error from "./Error.svelte";
    import type { IYupError } from "$lib/types/types";
    import { createId } from "$lib/utils";

    type TExdended = HTMLInputAttributes &
        HTMLTextareaAttributes &
        Partial<
            Omit<
                ComponentProps<typeof Datepicker>,
                "date" | "value" | "onchange"
            >
        >;
    interface IProps extends TExdended {
        label?: string;
        value?: string | number;
        type?: HTMLInputAttributes["type"] | "textarea";
        date?: string | Date;
        error?: IYupError;
        isErrorVisible?: boolean;
    }

    let {
        label,
        value = $bindable(""),
        date = $bindable(new Date()),
        onchange: onchangeProp,
        id = $bindable(createId()),
        error,
        isErrorVisible = true,
        ...rest
    }: IProps = $props();

    function onchange(
        e: Parameters<
            NonNullable<
                | HTMLInputAttributes["onchange"]
                | HTMLTextareaAttributes["onchange"]
            >
        >[0],
    ) {
        if (onchangeProp) onchangeProp(e as any);

        if (rest.type === "number") {
            const currentValue = Number(e.currentTarget.value);

            if (!e.currentTarget.value.length || !_.isNumber(currentValue)) {
                value = rest.min || 0;
            }

            if (_.isNumber(rest.min) && currentValue < rest.min) {
                value = rest.min;
            } else if (_.isNumber(rest.max) && currentValue > rest.max) {
                value = rest.max;
            }
        }
    }
</script>

<fieldset class="label">
    {#if label}
        <label
            aria-errormessage="{id}-error"
            aria-invalid={!!error}
            for={id}
            class="label-text text-surface-100 text-[0.9rem]"
        >
            {label}
        </label>
    {/if}
    {#if rest.type === "textarea"}
        <textarea
            aria-errormessage="{id}-error"
            aria-invalid={!!error}
            {id}
            bind:value
            {...rest}
            class={"input min-h-[2rem] " + rest.class}
            {onchange}
        ></textarea>
    {:else}
        <input
            aria-errormessage="{id}-error"
            aria-invalid={!!error}
            {id}
            bind:value
            {...rest}
            class={"input " + rest.class}
            {onchange}
        />
    {/if}
    {#if isErrorVisible}
        <Error id={id || ""} {error} />
    {/if}
</fieldset>

<style lang="scss">
    .date-picker {
        :global(input[type="text"]) {
            @apply input;
        }

        :global(#datepicker-dropdown) {
            width: 100%;
            max-width: 350px;

            :global([role="grid"]) {
                width: 100%;
            }

            :global(.mt-4.flex.justify-between) {
                :global(button:nth-of-type(1)) {
                    @apply btn bg-primary-500 text-white;
                }
                :global(button:nth-of-type(2)) {
                    @apply btn;
                }
                :global(button:nth-of-type(3)) {
                    @apply btn bg-success-600 text-white;
                }
            }
        }
    }
</style>
