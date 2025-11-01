<script lang="ts">
    import { Position } from '@xyflow/svelte';

    import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import type { GateData } from "$lib/types";
    import HandlerWrapper from '$lib/circuit/handler-wrapper.svelte';

    export let data: GateData;
    export let dragging = false;
    export let selected = false;

    let toggleEvent: () => void = data["toggle"];
</script>

<button on:click={toggleEvent} class="node" style="background-color: var(--color-bulb); font-size: xx-large;" class:dragging class:selected>
    <HandlerWrapper type="target" position={Position.Left} id="in-1" enabled={data['in-1']}/>
    <b><FontAwesomeIcon icon={faLightbulb}/></b>
</button>

<style>
    .node {
        padding: 8px;
    }
</style>
