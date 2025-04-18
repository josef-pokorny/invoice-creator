<script lang="ts">
    import { m } from "$lib/paraglide/messages";
    import type { Snippet } from "svelte";
    import type { ClassValue, HTMLAttributes } from "svelte/elements";

    let {
        isOpen = $bindable(false),
        content,
        button,
        classContentContainer,
        ...props
    }: {
        isOpen?: boolean;
        content: Snippet;
        button?: Snippet<
            [
                {
                    showModal?: () => void;
                    closeModal?: () => void;
                    isOpen: boolean;
                },
            ]
        >;
        classContentContainer?: ClassValue;
    } & HTMLAttributes<HTMLDialogElement> = $props();

    let elemModal: HTMLDialogElement | null = $state(null);

    function showModal() {
        isOpen = true;
    }

    function closeModal() {
        isOpen = false;
    }

    $effect(() => {
        if (isOpen) {
            elemModal?.showModal();

            setTimeout(() => {
                document.addEventListener("click", closeModal);
            }, 100);

            return () => {
                document.removeEventListener("click", closeModal);
            };
        } else {
            elemModal?.close();
        }
    });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<dialog
    bind:this={elemModal}
    {...props}
    class="  backdrop:bg-surface-950/85 top-1/2 left-1/2 z-10 max-w-[640px] -translate-1/2 bg-transparent p-3 {props.class}"
>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
        class="rounded-container bg-surface-950 border-surface-700 space-y-4 border-2 p-4 text-inherit shadow {classContentContainer}"
        onclick={(e) => {
            e.stopPropagation();
        }}
    >
        {@render content()}

        <form method="dialog" class="flex justify-end">
            <button
                type="button"
                class="btn preset-tonal hover:preset-filled"
                onclick={closeModal}
            >
                {m["actions.close"]()}
            </button>
        </form>
    </div>
</dialog>

{@render button?.({
    showModal,
    closeModal,
    isOpen,
})}

<style>
    dialog,
    dialog::backdrop {
        --anim-duration: 200ms;
        transition:
            display var(--anim-duration) allow-discrete,
            overlay var(--anim-duration) allow-discrete,
            opacity var(--anim-duration);
        opacity: 0;
    }

    dialog[open],
    dialog[open]::backdrop {
        opacity: 1;
    }

    @starting-style {
        dialog[open],
        dialog[open]::backdrop {
            opacity: 0;
        }
    }
</style>
