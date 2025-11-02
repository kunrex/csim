<script lang="ts">
    import { Position } from '@xyflow/svelte';

    import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import type { GateData } from "$lib/circuit";
    import HandlerWrapper from '$lib/circuit/handler-wrapper.svelte';

    export let data: GateData;
    export let dragging = false;
    export let selected = false;

    let enabled = data['out-1'];

    let toggleEvent = async () => {
        await data["toggle"]();
        enabled = data['out-1'];
    }
</script>

<button on:click={toggleEvent} class="node" class:dragging class:selected class:enabled>
    <b><FontAwesomeIcon icon={faPowerOff}/></b>
    <HandlerWrapper type="source" position={Position.Right} id="out-1" enabled={data['out-1']}/>
</button>


<style>
    .node {
        padding: 8px;
        font-size: xx-large;
        background-color: var(--color-bulb);
    }

    .node.enabled {
        padding: 4px;
        color: red;
    }
</style>
