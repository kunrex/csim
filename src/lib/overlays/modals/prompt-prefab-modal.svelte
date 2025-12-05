<script lang="ts">
    import { promptPrefabModal } from "$lib/overlays/modals/modal";
    import { PromptPrefabResult } from "$lib/overlays/modals/results";

    const state = promptPrefabModal.state;
    $: promptModal = $state;

    let value = "";
    function confirm(result: boolean) {
        if(!promptModal)
            return;

        promptModal.resolve(new PromptPrefabResult(result, value));
        promptPrefabModal.close();
        value = "";
    }
</script>

{#if promptModal }
    <div class="flex flex-row w-full h-full justify-center items-center z-50">
        <div class="flex flex-col gap-y-4 justify-center min-w-96 w-1/3 items-center fixed right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 p-4 text-white panel-background">
            <div class="text-3xl text-center">
                <b>Name Your Prefab!</b>
            </div>
            <input class="input-clean text-xl text-center font-bold" type="text" minlength="1" maxlength="32" placeholder="supercoolprefab" bind:value={value}>
            <div class="flex flex-row w-full justify-between">
                <button class="modal-button bg-emerald-500 disabled:bg-emerald-800" on:click={() => { confirm(true); }} disabled={value.length === 0}>
                    Confirm
                </button>
                <button class="modal-button bg-rose-600" on:click={() => { confirm(false); }}>
                    Cancel
                </button>
            </div>
        </div>
    </div>
{/if}
