<script lang="ts">
    import {Position, useNodesData, useUpdateNodeInternals} from "@xyflow/svelte";

    import type { PrefabGateData, UnaryGateData } from "$lib/core";

    import { capitalise } from "$lib/flow/utils.js";
    import type { GateProps } from "$lib/flow/types";
    import { InputPin, OutputPin } from "$lib/flow/gates/pins";

    let { data, dragging, selected, parentId } : GateProps<PrefabGateData> = $props();

    const bufferNodes = useNodesData(data.bufferTypeMap.keys().toArray());
    const buffers = $derived(bufferNodes.current.map((node) => ({
        id: node.id,
        data: node.data as UnaryGateData
    })));

    const powerBuffers = $derived(buffers.filter((node) => data.bufferTypeMap.get(node.id) == "power"));
    const clockBuffers = $derived(buffers.filter((node) => data.bufferTypeMap.get(node.id) == "clock"));
    const probeBuffers = $derived(buffers.filter((node) => data.bufferTypeMap.get(node.id) == "probe"));
    const displayBuffers = $derived(buffers.filter((node) => data.bufferTypeMap.get(node.id) == "display"));

    const connectable = !(!!parentId);
</script>

<div class="prefab-gate color-prefab h-full w-full" class:dragging class:selected class:expanded={data.expanded}>
    <div>
        <b>{ capitalise(data.type) }</b>
    </div>
    {#each powerBuffers as power, i}
        <InputPin id={data.bufferPinMap.get(power.id) ?? `in-${i + 1}`} label={power.data.name} enabled={power.data.in1} connectable={connectable} style={`top: ${(100 / (powerBuffers.length + 1)) * (i + 1)}%;`} />
    {/each}
    {#each clockBuffers as clock, i}
        <InputPin id={data.bufferPinMap.get(clock.id) ?? `clock-${i + 1}`} label={clock.data.name} enabled={clock.data.in1} position={Position.Top} connectable={connectable} style={`left: ${(100 / (clockBuffers.length + 1)) * (i + 1)}%;`} />
    {/each}
    {#each probeBuffers as probe, i}
        <OutputPin id={data.bufferPinMap.get(probe.id) ?? `out-${i + 1}`} label={probe.data.name} enabled={probe.data.out1} connectable={connectable} style={`top: ${(100 / (probeBuffers.length + 1)) * (i + 1)}%;`} />
    {/each}
    {#each displayBuffers as display, i}
        <OutputPin id={data.bufferPinMap.get(display.id) ?? `display-${i + 1}`} label={display.data.name} enabled={display.data.out1} position={Position.Bottom} connectable={connectable} style={`left: ${(100 / (displayBuffers.length + 1)) * (i + 1)}%;`} />
    {/each}
</div>
