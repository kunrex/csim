<script lang="ts">
    import { Position, useNodesData } from "@xyflow/svelte";

    import type { PrefabGateData, UnaryGateData } from "$lib/core";

    import { capitalise } from "$lib/flow/utils.js";
    import type { GateProps } from "$lib/flow/types";
    import { prefabHandleGap } from "$lib/flow/constants";
    import { InputPin, OutputPin } from "$lib/flow/gates/pins";

    let { data, dragging, selected, parentId } : GateProps<PrefabGateData> = $props();

    const bufferNodes = useNodesData(data.bufferMap.keys().toArray());
    const buffers = $derived(bufferNodes.current.map((node) => ({
        id: node.id,
        data: node.data as UnaryGateData
    })));

    const powerBuffers = $derived(buffers.filter((node) => data.bufferMap.get(node.id)?.type == "power"));
    const clockBuffers = $derived(buffers.filter((node) => data.bufferMap.get(node.id)?.type == "clock"));
    const probeBuffers = $derived(buffers.filter((node) => data.bufferMap.get(node.id)?.type == "probe"));
    const displayBuffers = $derived(buffers.filter((node) => data.bufferMap.get(node.id)?.type == "display"));

    const minimumHeight = $derived(prefabHandleGap * (Math.max(data.powerCount, data.probeCount) + 2));
    const minimumWidth = $derived(prefabHandleGap * (Math.max(data.clockCount, data.displayCount) + 2));

    const connectable = !(!!parentId);
</script>

<div class="prefab-gate color-prefab h-full w-full" class:dragging class:selected class:expanded={data.expanded} style={`min-height: ${minimumHeight}; min-width: ${minimumWidth}`}>
    <div>
        <b>{ capitalise(data.type) }</b>
    </div>
    {#each powerBuffers as power, i}
        <InputPin id={data.bufferMap.get(power.id)?.pin ?? `in-${i + 1}`} label={power.data.name} enabled={power.data.in1} connectable={connectable} style={`top: ${(100 / (powerBuffers.length + 1)) * (i + 1)}%;`} />
    {/each}
    {#each clockBuffers as clock, i}
        <InputPin id={data.bufferMap.get(clock.id)?.pin ?? `clock-${i + 1}`} label={clock.data.name} enabled={clock.data.in1} position={Position.Top} connectable={connectable} style={`left: ${(100 / (clockBuffers.length + 1)) * (i + 1)}%;`} />
    {/each}
    {#each probeBuffers as probe, i}
        <OutputPin id={data.bufferMap.get(probe.id)?.pin ?? `out-${i + 1}`} label={probe.data.name} enabled={probe.data.out1} connectable={connectable} style={`top: ${(100 / (probeBuffers.length + 1)) * (i + 1)}%;`} />
    {/each}
    {#each displayBuffers as display, i}
        <OutputPin id={data.bufferMap.get(display.id)?.pin ?? `display-${i + 1}`} label={display.data.name} enabled={display.data.out1} position={Position.Bottom} connectable={connectable} style={`left: ${(100 / (displayBuffers.length + 1)) * (i + 1)}%;`} />
    {/each}
</div>
