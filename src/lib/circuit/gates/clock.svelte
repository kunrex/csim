<script lang="ts">
    import { onMount } from "svelte";
    import { Position } from '@xyflow/svelte';

    import { faClock } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import type { GateData } from "$lib/circuit";
    import HandlerWrapper from '$lib/circuit/handler-wrapper.svelte';

    export let data: GateData;
    export let dragging = false;
    export let selected = false;

    let signal = false;
    let enabled = data['out-1'];
    const clockSignal: number = setInterval(async () => {
        if(signal) {
            await data["toggle"]();
            enabled = data['out-1'];
        }
    }, 500);

    let toggleEvent = async () => {
        signal = !signal;
    }

    onMount(() => { return () => clearInterval(clockSignal); });
</script>

<button on:click={toggleEvent} class="node" class:dragging class:selected class:enabled>
    <b><FontAwesomeIcon icon={faClock}/></b>
    <HandlerWrapper type="source" position={Position.Right} id="out-1" enabled={data['out-1']}/>
</button>

<style>
    .node {
        padding: 8px;
        font-size: xx-large;
        background-color: var(--color-clock);
    }

    .node.enabled {
        padding: 4px;
    }
</style>
