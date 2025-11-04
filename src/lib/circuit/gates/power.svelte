<script lang="ts">
    import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import type { GateData } from "$lib/circuit";

    import OutputHandle from '$lib/circuit/handles/output-handle.svelte';

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
    <OutputHandle id="out-1" enabled={data['out-1']}/>
</button>

<style>
    .node {
        padding: 8px;
        font-size: xx-large;
        background-color: var(--color-power);
    }

    .node.enabled {
        padding: 4px;
    }
</style>
