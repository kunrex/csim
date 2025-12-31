<script lang="ts">
    import { Position, useNodesData } from "@xyflow/svelte";

    import type { PrefabGateData, SevenSegmentGateData, UnaryGateData } from "$lib/core";

    import { capitalise } from "$lib/flow/utils.js";
    import type { GateProps } from "$lib/flow/types";
    import { prefabHandleGap } from "$lib/flow/constants";

    import { InputPin, OutputPin } from "$lib/flow/gates/pins";
    import { SevenSegmentDisplay } from "$lib/flow/gates/display";

    let { data, dragging, selected, parentId } : GateProps<PrefabGateData> = $props();

    const bufferNodes = useNodesData(data.bufferMap.keys().toArray());
    const displayNodes = useNodesData(data.displaySet.keys().toArray());

    const buffers = $derived(bufferNodes.current.map((node) => ({
        id: node.id,
        data: node.data as UnaryGateData
    })));

    const displays = $derived(displayNodes.current.map((node) => ({
        id: node.id,
        data: node.data as SevenSegmentGateData
    })));

    const powerBuffers = $derived(buffers.filter((node) => data.bufferMap.get(node.id)?.type == "power"));
    const clockBuffers = $derived(buffers.filter((node) => data.bufferMap.get(node.id)?.type == "clock"));
    const probeBuffers = $derived(buffers.filter((node) => data.bufferMap.get(node.id)?.type == "probe"));

    const minimumWidth = $derived(prefabHandleGap * (clockBuffers.length + 2));
    const minimumHeight = $derived(prefabHandleGap * (Math.max(powerBuffers.length, probeBuffers.length) + 2));

    const connectable = !(!!parentId);
</script>

<div class="prefab-gate flex flex-col color-prefab h-full w-full" class:dragging class:selected class:expanded={data.expanded} style={`min-height: ${minimumHeight}; min-width: ${minimumWidth}`}>
    {#each powerBuffers as power, i}
        <InputPin id={data.bufferMap.get(power.id)?.pin ?? `in-${i + 1}`} label={power.data.name} enabled={power.data.in1} connectable={connectable} style={`top: ${(100 / (powerBuffers.length + 1)) * (i + 1)}%;`} />
    {/each}
    {#each clockBuffers as clock, i}
        <InputPin id={data.bufferMap.get(clock.id)?.pin ?? `clock-${i + 1}`} label={clock.data.name} enabled={clock.data.in1} position={Position.Top} connectable={connectable} style={`left: ${(100 / (clockBuffers.length + 1)) * (i + 1)}%;`} />
    {/each}
    {#each probeBuffers as probe, i}
        <OutputPin id={data.bufferMap.get(probe.id)?.pin ?? `out-${i + 1}`} label={probe.data.name} enabled={probe.data.out1} connectable={connectable} style={`top: ${(100 / (probeBuffers.length + 1)) * (i + 1)}%;`} />
    {/each}
    {#if !data.expanded }
        <div class="flex flex-row gap-x-4">
            {#each displays as display, i}
                <div class="flex flex-col gap-y-4 color-display text-gray-300 text-lg p-4 rounded-lg">
                    <SevenSegmentDisplay value={display.data.value} decimal={display.data.in5} />
                    <div class="flex flex-row justify-center items-center w-full">
                        <b> { display.data.name} </b>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
    <div class="flex flex-row justify-center items-center w-full">
        <b>{ capitalise(data.type.name) }</b>
    </div>
</div>
