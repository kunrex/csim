<script lang="ts">
    import type { GateData } from "$lib/circuit";
    import { pixelHeight } from "$lib/circuit/constants";

    import InputHandle from '../handles/input-handle.svelte';
    import SevenSegment from "../display/seven-segment.svelte";

    export let data: GateData;
    export let dragging = false;
    export let selected = false;

    const height = pixelHeight * 8;
    const inSpacing = height / 7;
</script>

<div class="node" style={`height: ${height}px;`} class:dragging class:selected>
    <InputHandle id="in-1" style={`top: ${inSpacing}px;`} enabled={data["in-1"]} connected={data["in-1-connected"]}/>
    <InputHandle id="in-2" style={`top: ${inSpacing * 2 + 6}px;`} enabled={data["in-2"]} connected={data["in-2-connected"]}/>
    <InputHandle id="in-3" style={`top: ${inSpacing * 3 + 12}px;`} enabled={data["in-3"]} connected={data["in-3-connected"]}/>
    <InputHandle id="in-4" style={`top: ${inSpacing * 4 + 18}px;`} enabled={data["in-4"]} connected={data["in-4-connected"]}/>
    <InputHandle id="in-5" style={`top: ${inSpacing * 5 + 24}px;`} enabled={data["in-5"]} connected={data["in-5-connected"]}/>
    <SevenSegment value={data["value"]} decimal={data["in-5"]}/>
</div>

<style>
    .node {
        width: 120px;
        background-color: var(--color-display);
    }
</style>