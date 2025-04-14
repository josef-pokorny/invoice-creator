<script lang="ts">
    import { getLocale } from "$lib/paraglide/runtime";
    import { Datepicker } from "flowbite-svelte";
    import _ from "lodash";
    import type { ComponentProps } from "svelte";
    import type {
        HTMLInputAttributes,
        HTMLTextareaAttributes,
    } from "svelte/elements";

    interface IProps extends Partial<ComponentProps<typeof Datepicker>> {
        label?: string;
        type?: HTMLInputAttributes["type"] | "textarea";
        date?: Date;
    }

    let {
        label,
        value = $bindable(),
        onchange: onchangeProp,
        ...rest
    }: IProps = $props();

    const id = _.uniqueId("input_") + Math.random();

    function onchange(e: Parameters<NonNullable<IProps["onchange"]>>[0]) {
        if (onchangeProp) onchangeProp(e as any);
    }
</script>

<fieldset class="label">
    {#if label}
        <label for={id} class="label-text text-surface-100 text-[0.9rem]">
            {label}
        </label>
    {/if}
    <div class="date-picker">
        <Datepicker
            bind:value
            color="green"
            title={""}
            {id}
            autohide
            range={false}
            locale={getLocale()}
            disabled={rest.disabled || false}
            firstDayOfWeek={1}
            dateFormat={{}}
            placeholder=""
            required={rest.required || false}
            inputClass=""
            inline={false}
            showActionButtons
            {onchange}
            {...rest}
        />
    </div>
</fieldset>

<style lang="scss">
    @reference "../../../app.css";

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
