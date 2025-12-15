<script lang="ts">
    import { fade } from 'svelte/transition';

    import { messageOverlay}  from "$lib/overlays/states";

    const writableState = messageOverlay.state;
    const popupState = $derived($writableState);

    function submit() {
        messageOverlay.close();
    }
</script>

{#if popupState }
    <div class="overlay">
        <div class="overlay-backdrop bg-black/40" transition:fade={{ duration: 150 }}></div>
        <div class="fixed right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 min-w-96 w-1/3 text-white panel-background bg-black/40" transition:fade={{ duration: 200 }}>
            <form class="flex flex-col gap-y-4 justify-center items-center p-4" onsubmit={submit}>
                <div class="text-3xl text-gray-300 text-center">
                    <b> { popupState.title } </b>
                </div>
                <div class="text-lg text-gray-400 text-center font-extralight">
                    { popupState.message }
                </div>
                <div class="flex flex-row w-full justify-center items-center">
                    <button type="submit" class="modal-button bg-emerald-500 hover:bg-emerald-600 hover:cursor-pointer active:bg-emerald-400 disabled:bg-emerald-800 disabled:hover:text-white disabled:hover:cursor-not-allowed">
                        Back
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
