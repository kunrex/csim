<script lang="ts">
    import { fade } from 'svelte/transition';

    import { messageController }  from "../controllers";

    const controllerState = messageController.state;
    const resolvableState = $derived($controllerState);

    function submit() {
        messageController.close();
    }
</script>

{#if resolvableState }
    <div class="overlay">
        <div class="overlay-backdrop bg-black/40" transition:fade={{ duration: 150 }}></div>
        <div class="fixed right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 min-w-96 w-1/3 text-white panel-background bg-black/40" transition:fade={{ duration: 200 }}>
            <form class="flex flex-col gap-y-4 justify-center items-center p-4" onsubmit={submit}>
                <div class="text-3xl text-gray-300 text-center">
                    <b> { resolvableState.params.title } </b>
                </div>
                <div class="text-lg text-gray-400 text-center font-extralight">
                    { resolvableState.params.message }
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
