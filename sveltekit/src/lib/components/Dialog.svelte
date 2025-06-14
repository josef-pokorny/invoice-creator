<script lang="ts">
    import type { Snippet } from "svelte";
    import type { ClassValue, HTMLAttributes } from "svelte/elements";

    import { m } from "$lib/paraglide/messages";

    let {
        isOpen = $bindable(false),
        content,
        button,
        classContentContainer,
        classForm,
        footerButtons,
        ...props
    }: {
        isOpen?: boolean;
        content: Snippet;
        button?: Snippet<
            [
                {
                    showModal: () => void;
                    closeModal: () => void;
                    toggleOpen: () => void;
                    isOpen: boolean;
                },
            ]
        >;
        classContentContainer?: ClassValue;
        classForm?: ClassValue;
        /** use type="submit" on <button> when you want to close the modal */
        footerButtons?: Snippet;
    } & HTMLAttributes<HTMLDialogElement> = $props();

    let elemModal: HTMLDialogElement | null = $state(null);

    function showModal() {
        isOpen = true;
    }

    function closeModal() {
        isOpen = false;
    }

    function toggleOpen() {
        isOpen = !isOpen;
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
    class={props.class}
    class:grid={isOpen}
>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
        class="rounded-container"
        onclick={(e) => {
            e.stopPropagation();
        }}
    >
        <div class="content">
            {@render content()}
        </div>

        <form class={classForm} method="dialog" onsubmit={closeModal}>
            <button
                class="btn preset-tonal hover:preset-filled"
                onclick={closeModal}
                type="submit"
            >
                {m["actions.close"]()}
            </button>
        </form>
    </div>
</dialog>

{@render button?.({
    showModal,
    closeModal,
    toggleOpen,
    isOpen,
})}

<style lang="scss">
    dialog {
        @apply backdrop:bg-surface-950/85 fixed inset-0 top-1/2 left-1/2 z-10 h-screen max-w-[640px] -translate-1/2 items-center overflow-hidden bg-transparent p-3 !outline-none;

        .rounded-container {
            @apply bg-surface-950 border-surface-700 my-auto flex max-h-full flex-col space-y-4 overflow-hidden border-2 p-0 text-inherit shadow;

            .content {
                @apply m-0 min-w-1 flex-1 overflow-auto p-6;
            }

            form {
                @apply flex justify-end p-4;
                border-top: 1px solid var(--color-surface-700);
            }
        }

        &[open],
        &[open]::backdrop {
            opacity: 1;

            @starting-style {
                opacity: 0.1;
            }
        }
    }

    dialog,
    dialog::backdrop {
        --anim-duration: 200ms;
        transition:
            display var(--anim-duration) allow-discrete,
            overlay var(--anim-duration) allow-discrete,
            opacity var(--anim-duration);
        opacity: 0;
    }
</style>
