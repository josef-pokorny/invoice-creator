<script lang="ts">
    import { getLocale } from "$lib/paraglide/runtime";
    import type { IYupError } from "$lib/types/types";
    import { Datepicker } from "flowbite-svelte";
    import _ from "lodash";
    import type { ComponentProps } from "svelte";
    import type {
        HTMLInputAttributes,
        HTMLTextareaAttributes,
    } from "svelte/elements";
    import Error from "./Error.svelte";
    import { createId } from "$lib/utils";

    interface IProps extends Partial<ComponentProps<typeof Datepicker>> {
        label?: string;
        type?: HTMLInputAttributes["type"] | "textarea";
        date?: Date;
        isoDate?: string;
        error?: IYupError;
    }

    let {
        label,
        value = $bindable(),
        isoDate = $bindable(),
        onchange: onchangeProp,
        error,
        ...rest
    }: IProps = $props();

    const id = createId();

    function onchange(e: Parameters<NonNullable<IProps["onchange"]>>[0]) {
        if (onchangeProp) onchangeProp(e as any);
    }

    $effect(() => {
        isoDate = value ? value.toISOString() : "";
    });

    $effect(() => {
        if (error) {
            let input = document.querySelector(
                `#wrapper-${id} .date-picker input`,
            );

            if (input) {
                input.ariaInvalid = "true";

                return () => {
                    input.ariaInvalid = "false";
                };
            }
        }
    });
</script>

<fieldset class="label" id="wrapper-{id}">
    {#if label}
        <label for={id} class="label-text text-surface-100 text-[0.9rem]">
            {label}
        </label>
    {/if}
    <div class="date-picker">
        <Datepicker
            bind:value
            color="green"
            title={String(label)}
            placeholder={String(label)}
            {id}
            autohide
            range={false}
            locale={getLocale()}
            disabled={rest.disabled || false}
            firstDayOfWeek={1}
            dateFormat={{}}
            required={rest.required || false}
            inputClass="input"
            inline={false}
            showActionButtons
            aria-invalid={!!error}
            {onchange}
            {...rest}
        />
    </div>
    <Error id={id || ""} {error} />
</fieldset>

<style lang="scss">
    .date-picker {
        :global(input[type="text"]) {
            @apply input placeholder-transparent;
        }

        :global(input[type="text"][aria-invalid="true"]) {
            @include errorInput;
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
