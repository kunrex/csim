<script lang="ts">
    import { fade } from 'svelte/transition';

    import { prefabOverlay } from "$lib/overlays/states";

    interface PromptPrefabProps {
        duplicateCheck: (value: string) => boolean;
    }

    let { duplicateCheck }: PromptPrefabProps = $props();

    const writableState = prefabOverlay.state;
    const modalState = $derived($writableState);

    let value = $state("");
    let disabled = $derived(value.length == 0 || duplicateCheck(value));

    function submit(e: SubmitEvent) : void {
        e.preventDefault();
        if(!modalState || disabled)
            return;

        modalState.resolve({ result: true, value: value });
        prefabOverlay.close();
        value = "";
    }

    function cancel() : void {
        if(!modalState)
            return;

        modalState.resolve({ result: false, value: value });
        prefabOverlay.close();
        value = "";
    }
</script>

{#if modalState }
    <div class="overlay">
        <div class="overlay-backdrop" transition:fade={{ duration: 150 }}></div>
        <div class="fixed right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 min-w-96 w-1/3 text-white panel-background bg-black/40" transition:fade={{ duration: 200 }}>
            <form class="flex flex-col gap-y-4 justify-center items-center p-4" onsubmit={submit}>
                <div class="text-3xl text-center">
                    <b>Name Your Prefab!</b>
                </div>
                <input class="input-clean text-xl text-center font-bold" type="text" minlength="1" maxlength="32" placeholder="supercoolprefab" bind:value={value}>
                <div class="flex flex-row w-full justify-between items-center">
                    <button type="submit" class="modal-button bg-emerald-500 hover:bg-emerald-600 hover:cursor-pointer active:bg-emerald-400 disabled:bg-emerald-800 disabled:hover:text-white disabled:hover:cursor-not-allowed" disabled={disabled}>
                        Confirm
                    </button>
                    <div class="w-full text-lg font-extralight text-center">
                        {#if value.length === 0 }
                            <div class="text-red-700">*name cannot be empty</div>
                        {:else if duplicateCheck(value)}
                            <div class="text-red-700">*gate already exists</div>
                        {:else}
                            <div class="text-emerald-500">valid</div>
                        {/if}
                    </div>
                    <button type="button" class="modal-button bg-rose-500 hover:bg-rose-600 hover:cursor-pointer active:bg-rose-400" onclick={cancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
