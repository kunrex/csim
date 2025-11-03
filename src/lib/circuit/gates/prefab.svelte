<script lang="ts">
    import type { GateData } from "$lib/circuit";
    import { pixelHeight } from "$lib/circuit/constants";

    import InputHandle from '../handles/input-handle.svelte';
    import OutputHandle from '$lib/circuit/handles/output-handle.svelte';

    export let data: GateData;
    export let dragging = false;
    export let selected = false;

    const inCount: number = data["in"];
    const outCount: number = data["out"];
    const max = inCount > outCount ? inCount : outCount;

    const height = pixelHeight * (max + 2);
    const inSpacing = height / (inCount + 1);
    const outSpacing = height / (outCount + 1);
</script>

<div class="node" style={`height: ${height}px;`} class:dragging class:selected>
    {#each { length: inCount } as _, i}
        <InputHandle style={`top: ${inSpacing * (i + 1)}px;`} id={"in-" + (i + 1)} enabled={data["in-" + (i + 1)]} connected={data["in-" + (i + 1) + "connected"]}/>
    {/each}
    <div>
        <b>{ data["name"] }</b>
    </div>
    {#each { length: outCount } as _, i}
        <OutputHandle style={`top: ${outSpacing * (i + 1)}px;`} id={"out-" + (i + 1)} enabled={data["out-" + (i + 1)]}/>
    {/each}
</div>

<style>
    .node {
        background-color: var(--color-prefab);
    }
</style>