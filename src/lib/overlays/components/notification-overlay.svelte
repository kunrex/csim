<script lang="ts">
    import { faBell } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import { fly } from 'svelte/transition';

    import { notificationOverlay } from "$lib/overlays/controllers";

    const controllerState = notificationOverlay.state;
    const resolvableState = $derived($controllerState);

    function close() {
        if(!resolvableState)
            return;

        resolvableState.resolve();
        notificationOverlay.close();
    }

    $effect(() => {
        if(!resolvableState)
            return;

        setTimeout(close, 1200);
    })
</script>

<style>
    @keyframes bell-ring {
        0%   { transform: rotate(0deg); }
        10%  { transform: rotate(15deg); }
        20%  { transform: rotate(-15deg); }
        30%  { transform: rotate(12deg); }
        40%  { transform: rotate(-12deg); }
        50%  { transform: rotate(8deg); }
        60%  { transform: rotate(-8deg); }
        70%  { transform: rotate(4deg); }
        80%  { transform: rotate(-4deg); }
        100% { transform: rotate(0deg); }
    }

    .bell {
        display: inline-block;
        transform-origin: top center;
        animation: bell-ring 1.2s ease-in-out infinite;
    }
</style>

{#if resolvableState !== null }
    <div class="overlay">
        <div class="flex flex-col gap-y-4 justify-center items-center fixed right-1/2 top-24 translate-x-1/2 -translate-y-1/2" transition:fly={{ y: -20, opacity: 0, duration: 200 }}>
            <div class="text-xl text-gray-300 font-extralight py-2">
                <div class="bell">
                    <FontAwesomeIcon icon={faBell}></FontAwesomeIcon>
                </div>
                { resolvableState.params }
            </div>
        </div>
    </div>
{/if}
