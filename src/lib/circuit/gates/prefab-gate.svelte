<script lang="ts">
    import type { GateData } from "$lib/logic";

    import { InputHandle, ClockHandle, OutputHandle, DisplayHandle } from "$lib/circuit/handles";

    export let data: GateData;
    export let dragging = false;
    export let selected = false;

    const gate = data["gate"] as string;

    const inCount = data["in"] as number;
    const outCount = data["out"] as number;
    const clockCount = data["clock"] as number;
    const displayCount = data["display"] as number;

    const verticalHandles = inCount > outCount ? inCount : outCount;
    const horizontalHandles = clockCount > displayCount * 4 ? clockCount : displayCount * 4;

    const width = `width: calc(var(--prefab-handle-gap) * ${horizontalHandles + 2})`;
    const height = `height: calc(var(--prefab-handle-gap) * ${verticalHandles + 2})`;

    function inputHandle(index: number) : GateData {
        return data["in-" + index] as GateData ?? { };
    }

    function clockHandle(index: number) : GateData {
        return data["clock-" + index] as GateData ?? { };
    }

    function outputHandle(index: number) : GateData {
        return data["out-" + index] as GateData ?? { };
    }

    function displayHandle(index: number) : GateData {
        return data["display-" + index] as GateData ?? { };
    }
</script>

<div class="prefab-gate color-prefab" class:dragging class:selected style={`${height}; ${width};`}>
    {#each { length: inCount } as _, i}
        <InputHandle id={"in-" + i} style={`top: ${(100 / (inCount + 1)) * (i + 1)}%;`} enabled={inputHandle(i + 1)["in-1"]}></InputHandle>
    {/each}
    {#each { length: clockCount } as _, i}
        <ClockHandle id={"clock-" + i} style={`left: ${(100 / (clockCount + 1)) * (i + 1)}%;`} enabled={clockHandle(i + 1)["in-1"]}></ClockHandle>
    {/each}
    <div class="p-1 overflow-x-scroll overflow-hidden">
        <b>{ gate }</b>
    </div>
    {#each { length: outCount } as _, i}
        <OutputHandle id={"out-" + i} style={`top: ${(100 / (outCount + 1)) * (i + 1)}%;`} enabled={outputHandle(i + 1)["out-1"]}></OutputHandle>
    {/each}
    {#each { length: displayCount } as _, i}
        <DisplayHandle id={"out-" + i} style={`left: ${(100 / (displayCount + 1)) * (i + 1)}%;`} enabled={displayHandle(i + 1)["out-1"]}></DisplayHandle>
    {/each}
</div>
