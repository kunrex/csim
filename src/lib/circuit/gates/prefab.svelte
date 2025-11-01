<script lang="ts">
    import { Position } from '@xyflow/svelte';

    import type { GateData } from "$lib/types";
    import HandlerWrapper from '$lib/circuit/handler-wrapper.svelte';
    import { pixelHeight } from "$lib/circuit/constants";

    export let data: GateData;

    const inCount: number = data["in"];
    const outCount: number = data["out"];
    const max = inCount > outCount ? inCount : outCount;

    const height = pixelHeight * (max + 2);
    const inSpacing = height / (inCount + 1);
    const outSpacing = height / (outCount + 1);

    export let dragging = false;
    export let selected = false;
</script>

<div class="node" style={`height: ${height}px;`} class:dragging class:selected>
    {#each { length: inCount } as _, i}
        <HandlerWrapper type="target" position={Position.Left} style={`top: ${inSpacing * (i + 1)}px;`} id={"in-" + (i + 1)} enabled={data["in-" + (i + 1)]}/>
    {/each}
    <div>
        <b>{ data["name"] }</b>
    </div>
    {#each { length: outCount } as _, i}
        <HandlerWrapper type="source" position={Position.Right} style={`top: ${outSpacing * (i + 1)}px;`} id={"out-" + (i + 1)} enabled={data["out-" + (i + 1)]}/>
    {/each}
</div>

<style>
    .node {
        background-color: var(--color-prefab);
    }
</style>