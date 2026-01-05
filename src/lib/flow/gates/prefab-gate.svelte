<script lang="ts">
    import { Position, useNodesData } from "@xyflow/svelte";

    import type { PrefabGateData, SevenSegmentGateData, UnaryGateData } from "$lib/core";

    import { capitalise } from "$lib/flow/utils";
    import type { GateProps } from "$lib/flow/types";
    import { prefabHandleGap } from "$lib/flow/constants";

    import { InputPin, OutputPin } from "$lib/flow/gates/pins";
    import { SevenSegmentDisplay } from "$lib/flow/gates/display";

    let { data, dragging, selected, parentId } : GateProps<PrefabGateData> = $props();

    const gateData = data.ref;

    const bufferNodes = useNodesData(gateData.bufferMap.keys().toArray());
    const displayNodes = useNodesData(gateData.displaySet.keys().toArray());

    const buffers = $derived(bufferNodes.current.map((node) => ({
        id: node.id,
        data: node.data.ref as UnaryGateData
    })));

    const displays = $derived(displayNodes.current.map((node) => ({
        id: node.id,
        data: node.data.ref as SevenSegmentGateData
    })));

    const powerBuffers = $derived(buffers.filter((node) => gateData.bufferMap.get(node.id)?.type == "power"));
    const clockBuffers = $derived(buffers.filter((node) => gateData.bufferMap.get(node.id)?.type == "clock"));
    const probeBuffers = $derived(buffers.filter((node) => gateData.bufferMap.get(node.id)?.type == "probe"));

    const minimumWidth = $derived(prefabHandleGap * (clockBuffers.length + 2));
    const minimumHeight = $derived(prefabHandleGap * (Math.max(powerBuffers.length, probeBuffers.length) + 2));

    const connectable = !(!!parentId);
</script>

<div class="prefab-gate flex flex-col color-prefab h-full w-full" class:dragging class:selected class:expanded={data.ref.expanded} style={`min-height: ${minimumHeight}px; min-width: ${minimumWidth}px;`}>
    {#each powerBuffers as power, i (power.id)}
        <InputPin id={gateData.bufferMap.get(power.id)?.pin ?? `in-${i + 1}`} label={power.data.name} enabled={power.data.in1} connectable={connectable} style={`top: ${(100 / (powerBuffers.length + 1)) * (i + 1)}%;`} />
    {/each}
    {#each clockBuffers as clock, i (clock.id)}
        <InputPin id={gateData.bufferMap.get(clock.id)?.pin ?? `clock-${i + 1}`} label={clock.data.name} enabled={clock.data.in1} position={Position.Top} connectable={connectable} style={`left: ${(100 / (clockBuffers.length + 1)) * (i + 1)}%;`} />
    {/each}
    {#each probeBuffers as probe, i (probe.id)}
        <OutputPin id={gateData.bufferMap.get(probe.id)?.pin ?? `out-${i + 1}`} label={probe.data.name} enabled={probe.data.out1} connectable={connectable} style={`top: ${(100 / (probeBuffers.length + 1)) * (i + 1)}%;`} />
    {/each}
    {#if displays.length > 0 && !data.ref.expanded }
        <div class="flex flex-row gap-x-4 mb-1">
            {#each displays as display (display.id)}
                <div class="flex flex-col text-slate-100 px-7 py-3 rounded-md border-2 border-slate-600 color-display">
                    <SevenSegmentDisplay value={display.data.value} decimal={display.data.in5} />
                    <div class="flex flex-row justify-center items-center w-full overflow-x-scroll overflow-scrollbar mt-1">
                        <b> { display.data.name} </b>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
    <div class="flex flex-row justify-center items-center whitespace-nowrap">
        <b>{ capitalise(gateData.type.name) }</b>
    </div>
</div>
