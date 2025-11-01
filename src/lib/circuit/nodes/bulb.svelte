<script lang="ts">
    import { Position } from '@xyflow/svelte';

    import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import type { GateData } from "$lib/types";
    import HandlerWrapper from '$lib/circuit/handler-wrapper.svelte';

    export let data: GateData;
    export let dragging = false;
    export let selected = false;
</script>

<div class="node" class:dragging class:selected>
    <HandlerWrapper type="target" position={Position.Left} id="in-1" enabled={data['in-1']}/>
    <div>
        <b><FontAwesomeIcon icon={faLightbulb}/></b>
    </div>
</div>

<style>
    .node {
        padding: 8px;
    }
</style>
