<script lang="ts">
    import { fade } from 'svelte/transition';

    import { minToggleLimit, maxToggleLimit, minDeltaLimit, maxDeltaLimit, getDeltaLimit, setDeltaLimit, getToggleLimit, setToggleLimit } from "$lib/core";

    import { settingsOverlay } from "$lib/overlays/controllers";

    const writableState = settingsOverlay.state;
    const resolvableState = $derived($writableState);

    let deltaLimit = $state(getDeltaLimit());
    let toggleLimit = $state(getToggleLimit());

    function submit(e: SubmitEvent) : void {
        e.preventDefault();
        if(!resolvableState)
            return;

        resolvableState.resolve();
        settingsOverlay.close();
    }

    function onChangeDelta() : void {
        setDeltaLimit(deltaLimit);
    }

    function onChangeToggle() : void {
        setToggleLimit(toggleLimit);
    }
</script>

<style>
    input[type="range"] {
        --thumb-height: 1.375em;
        --track-height: 0.125em;
        --track-color: rgba(0, 0, 0, 0.2);
        --brightness-hover: 180%;
        --brightness-down: 80%;
        --clip-edges: 0.0125em;
        --thumb-width: 0.5em;
    }

    input[type="range"] {
        position: relative;
        background: #fff0;
        overflow: hidden;
    }

    input[type="range"]:active {
        cursor: grabbing;
    }

    input[type="range"]:disabled {
        filter: grayscale(1);
        opacity: 0.3;
        cursor: not-allowed;
    }

    input[type="range"],
    input[type="range"]::-webkit-slider-runnable-track,
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        transition: all ease 100ms;
        height: var(--thumb-height);
    }

    input[type="range"]::-webkit-slider-runnable-track,
    input[type="range"]::-webkit-slider-thumb {
        position: relative;
    }

    input[type="range"]::-webkit-slider-thumb {
        --thumb-radius: calc((var(--thumb-height) * 0.5) - 1px);
        --clip-top: calc((var(--thumb-height) - var(--track-height)) * 0.5 - 0.5px);
        --clip-bottom: calc(var(--thumb-height) - var(--clip-top));
        --clip-further: calc(100% + 1px);
        --box-fill: calc(-100vmax - var(--thumb-width, var(--thumb-height))) 0 0
        100vmax currentColor;

        width: var(--thumb-width, var(--thumb-height));
        background: currentColor linear-gradient(currentColor 0 0) no-repeat scroll left center;
        box-shadow: var(--box-fill);
        border-radius: var(--thumb-width, var(--thumb-height));

        filter: brightness(100%);
        clip-path: polygon(
                100% -1px,
                var(--clip-edges) -1px,
                0 var(--clip-top),
                -100vmax var(--clip-top),
                -100vmax var(--clip-bottom),
                0 var(--clip-bottom),
                var(--clip-edges) 100%,
                var(--clip-further) var(--clip-further)
        );
    }

    input[type="range"]:hover::-webkit-slider-thumb {
        filter: brightness(var(--brightness-hover));
        cursor: grab;
    }

    input[type="range"]:active::-webkit-slider-thumb {
        filter: brightness(var(--brightness-down));
        cursor: grabbing;
    }

    input[type="range"]::-webkit-slider-runnable-track {
        background: linear-gradient(var(--track-color) 0 0) scroll no-repeat center /
		100% calc(var(--track-height) + 1px);
    }

    input[type="range"]:disabled::-webkit-slider-thumb {
        cursor: not-allowed;
    }

    input[type="range"],
    input[type="range"]::-moz-range-track,
    input[type="range"]::-moz-range-thumb {
        appearance: none;
        transition: all ease 100ms;
        height: var(--thumb-height);
    }

    input[type="range"]::-moz-range-track,
    input[type="range"]::-moz-range-thumb,
    input[type="range"]::-moz-range-progress {
        background: #fff0;
    }

    input[type="range"]::-moz-range-thumb {
        background: currentColor;
        border: 0;
        width: var(--thumb-width, var(--thumb-height));
        border-radius: var(--thumb-width, var(--thumb-height));
        cursor: grab;
    }

    input[type="range"]:active::-moz-range-thumb {
        cursor: grabbing;
    }

    input[type="range"]::-moz-range-track {
        width: 100%;
        background: var(--track-color);
    }

    input[type="range"]::-moz-range-progress {
        appearance: none;
        background: currentColor;
        transition-delay: 30ms;
    }

    input[type="range"]::-moz-range-track,
    input[type="range"]::-moz-range-progress {
        height: calc(var(--track-height) + 1px);
        border-radius: var(--track-height);
    }

    input[type="range"]::-moz-range-thumb,
    input[type="range"]::-moz-range-progress {
        filter: brightness(100%);
    }

    input[type="range"]:hover::-moz-range-thumb,
    input[type="range"]:hover::-moz-range-progress {
        filter: brightness(var(--brightness-hover));
    }

    input[type="range"]:active::-moz-range-thumb,
    input[type="range"]:active::-moz-range-progress {
        filter: brightness(var(--brightness-down));
    }

    input[type="range"]:disabled::-moz-range-thumb {
        cursor: not-allowed;
    }
</style>

{#if resolvableState }
    <div class="overlay">
        <div class="overlay-backdrop" transition:fade={{ duration: 150 }}></div>
        <div class="fixed right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 min-w-96 w-1/3 text-white panel-background bg-black/40" transition:fade={{ duration: 200 }}>
            <form class="flex flex-col gap-y-6 justify-center items-center p-4" onsubmit={submit}>
                <div class="text-3xl text-gray-300 text-center">
                    <b>Simulation Settings</b>
                </div>
                <div class="text-lg text-gray-400 text-center font-extralight">
                    These parameters are used to limit the number of changes in a single event cycle. They help the simulation identify possible <b>Combinational Circuits</b>.
                </div>
                <div class="w-full text-start text-lg">
                    <div class="text-gray-300">
                        <b>Delta Limit</b>
                    </div>
                    <div class="text-[1rem] font-extralight text-gray-400">
                        Limits the maximum number of changes in a single cycle.
                    </div>
                    <div class="flex flex-row gap-x-4">
                        <div class="font-extralight">
                            { minDeltaLimit }
                        </div>
                        <input type="range" class="text-2xl flex-1 bg-blue-500 hover:bg-blue-300 active:cursor-grabbing" step={10} bind:value={deltaLimit} min={minDeltaLimit} max={maxDeltaLimit} onchange={onChangeDelta} />
                        <div class="font-extralight">
                            { maxDeltaLimit }
                        </div>
                    </div>
                </div>
                <div class="w-full text-start text-lg">
                    <div class="text-gray-300">
                        <b>Toggle Limit</b>
                    </div>
                    <div class="text-[1rem] font-extralight text-gray-400">
                        Limits the maximum number of changes per gate in a single cycle.
                    </div>
                    <div class="flex flex-row gap-x-4">
                        <div class="font-extralight">
                            { minToggleLimit }
                        </div>
                        <input type="range" class="text-2xl w-full bg-blue-500 hover:bg-blue-300 active:cursor-grabbing" step={10} bind:value={toggleLimit} min={minToggleLimit} max={maxToggleLimit} onchange={onChangeToggle} />
                        <div class="font-extralight">
                            { maxToggleLimit }
                        </div>
                    </div>
                </div>
                <div class="flex flex-row w-full justify-center items-center">
                    <button type="submit" class="modal-button bg-emerald-500 hover:bg-emerald-600 hover:cursor-pointer active:bg-emerald-400 disabled:bg-emerald-800 disabled:hover:text-white disabled:hover:cursor-not-allowed">
                        Confirm
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
