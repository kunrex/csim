<script lang="ts">
    import { Position } from '@xyflow/svelte';

    import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import Connector from '$lib/components/connector.svelte';

    export let dragging = false;
</script>

<div class="node" class:dragging>
    <div>
        <b><FontAwesomeIcon icon={faPowerOff}/></b>
    </div>
    <Connector type="source" position={Position.Right} id="out-1"/>
</div>

<style>
    .node {
        padding: 8px;
    }
</style>
