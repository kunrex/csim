<script lang="ts">
    import { Position } from '@xyflow/svelte';

    import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import Connector from '$lib/components/connector.svelte';

    export let dragging = false;
</script>

<div class="node" class:dragging>
    <Connector type="target" position={Position.Left} id="in-1"/>
    <div>
        <b><FontAwesomeIcon icon={faLightbulb}/></b>
    </div>
</div>

<style>
    .node {
        padding: 8px;
    }
</style>
