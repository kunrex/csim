<script lang="ts">
    import type { GateData } from "$lib/logic";

    import { InputHandle, ClockHandle, OutputHandle, DisplayHandle } from "$lib/circuit/handles";

    export let data: GateData;
    export let dragging = false;
    export let selected = false;

    const gate = data["type"] as string;

    const ins = data["in"] as string[];
    const outs = data["out"] as string[];
    const clocks = data["clock"] as string[];
    const displays = data["display"] as string[];

    function max(a: number, b: number): number {
        return a > b ? a : b;
    }

    const height = `min-height: calc(var(--prefab-handle-gap) * ${max(ins.length, outs.length) + 2})`;
    const width = `min-width: calc(var(--prefab-handle-gap) * ${max(clocks.length, displays.length) + 2})`;
</script>

<div class="prefab-gate color-prefab" class:dragging class:selected style={`${height}; ${width};`}>
    {#each ins as input, i}
        <InputHandle id={input} style={`top: ${(100 / (ins.length + 1)) * (i + 1)}%;`} enabled={data[input]}></InputHandle>
    {/each}
    {#each clocks as clock, i}
        <ClockHandle id={clock} style={`left: ${(100 / (clocks.length + 1)) * (i + 1)}%;`} enabled={data[clock]}></ClockHandle>
    {/each}
    <div class="p-1 overflow-x-scroll overflow-hidden">
        <b>{ gate }</b>
    </div>
    {#each outs as output, i}
        <OutputHandle id={output} style={`top: ${(100 / (outs.length + 1)) * (i + 1)}%;`} enabled={data[output]}></OutputHandle>
    {/each}
    {#each displays as display, i}
        <DisplayHandle id={display} style={`left: ${(100 / ((displays.length * 5) + 1)) * (i + 1)}%;`} enabled={data[display]}></DisplayHandle>
    {/each}
</div>
