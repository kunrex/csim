<script lang="ts">
    import { Position } from '@xyflow/svelte';

    import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import type { GateData } from "$lib/circuit";
    import HandlerWrapper from '$lib/circuit/handler-wrapper.svelte';

    export let data: GateData;
    export let dragging = false;
    export let selected = false;

    let enabled = data["in-1"];
</script>

<div class="node" class:dragging class:selected class:enabled>
    <HandlerWrapper type="target" position={Position.Left} id="in-1" enabled={data["in-1"]}/>
    <b><FontAwesomeIcon icon={faLightbulb}/></b>
</div>

<style>
    .node {
        padding: 8px;
        font-size: xx-large;
        background-color: var(--color-bulb);
    }

    .node.enabled {
        padding: 4px;
        background-color: red;
    }
</style>
