<script lang="ts">
    import Datepicker from "flowbite-svelte/Datepicker.svelte";
    import type { ComponentProps } from "svelte";
    import type { HTMLInputAttributes } from "svelte/elements";

    import { getLocale } from "$lib/paraglide/runtime";
    import type { IYupError } from "$lib/types/types";
    import { createId } from "$lib/utils";

    import Error from "./Error.svelte";

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

    let wrapperEl: HTMLElement | null;
    $effect(() => {
        const input = wrapperEl?.querySelector(`.date-picker input`);

        if (input) {
            input.id = id;

            if (error) {
                input.ariaInvalid = "true";

                return () => {
                    input.ariaInvalid = "false";
                };
            }
        }
    });
</script>

<fieldset bind:this={wrapperEl} class="label">
    {#if label}
        <label class="label-text text-surface-100 text-[0.9rem]" for={id}>
            {label}
        </label>
    {/if}
    <div class="date-picker">
        <Datepicker
            {id}
            aria-invalid={!!error}
            autohide
            color="green"
            dateFormat={{}}
            disabled={rest.disabled || false}
            locale={getLocale()}
            placeholder={String(label)}
            title={String(label)}
            bind:value
            range={false}
            firstDayOfWeek={1}
            required={rest.required || false}
            inputClass="input"
            inline={false}
            showActionButtons
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
