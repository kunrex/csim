<script lang="ts">
    import { Position } from '@xyflow/svelte';

    import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import type { GateData } from "$lib/types";
    import HandlerWrapper from '$lib/circuit/handler-wrapper.svelte';

    export let data: GateData;
    export let dragging = false;
    export let selected = false;
</script>

<div class="node" class:dragging class:selected>
    <div>
        <b><FontAwesomeIcon icon={faPowerOff}/></b>
    </div>
    <HandlerWrapper type="source" position={Position.Right} id="out-1" enabled={data['out-1']}/>
</div>

<style>
    .node {
        padding: 8px;
    }
</style>
