<script>
    import { fade } from "svelte/transition";

    import svg from "$lib/assets/favicon.svg";
</script>

<style>
    .icon {
        animation: pulse 1.6s ease-in-out infinite;
        transform-origin: center;
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }
</style>

<div class="overlay">
    <div class="overlay-backdrop bg-black/40" transition:fade={{ duration: 150 }}></div>
    <div class="fixed right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-y-8" transition:fade={{ duration: 200 }}>
        <img src={svg} alt="favicon" class="icon w-24 h-24" />
        <div class="font-bold text-xl text-white text-center">
            Your screen appears to be too small, try resizing it!
        </div>
    </div>
</div>
