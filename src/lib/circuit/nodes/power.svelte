<script lang="ts">
    import { Position } from '@xyflow/svelte';

    import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import type { GateData } from "$lib/types";
    import HandlerWrapper from '$lib/circuit/handler-wrapper.svelte';

    export let data: GateData;
    export let dragging = false;
    export let selected = false;

    let toggleEvent: () => void = data["toggle"];
</script>

<button on:click={toggleEvent} class="node" style="background-color: var(--color-power); font-size: xx-large;" class:dragging class:selected>
    <b><FontAwesomeIcon icon={faPowerOff}/></b>
    <HandlerWrapper type="source" position={Position.Right} id="out-1" enabled={data['out-1']}/>
</button>

<style>
    .node {
        padding: 8px;
    }
</style>
