<script lang="ts">
    import { fade } from 'svelte/transition';

    import { loadingController } from "$lib/overlays/controllers";

    const controllerState = loadingController.state;
    const resolvableState = $derived($controllerState);

    $effect(() => {
        if(!resolvableState)
            return;

        resolvableState.params.action.then(() => loadingController.close());
    });
</script>

<style>
    @keyframes ripple {
        from {
            width: 0.1%;
            height: 0.1%;
            opacity: 1;
        }
        to {
            width: 100%;
            height: 100%;
            opacity: 0;
        }
    }

    .ripple-loader {
        animation: ripple 1.2s ease infinite;
    }
</style>

{#if resolvableState !== null }
    <div class="overlay">
        <div class="overlay-backdrop bg-black/40" transition:fade={{ duration: 150 }}></div>
        <div class="flex flex-col gap-y-4 justify-center items-center fixed right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2" transition:fade={{ duration: 200 }}>
            <div class="w-16 h-16 relative">
                <div class="w-16 h-16 top-1/2 left-1/2 absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-300 ripple-loader"></div>
            </div>
            <div class="text-xl text-gray-300 font-extralight">
                { resolvableState.params.title }
            </div>
        </div>
    </div>
{/if}
