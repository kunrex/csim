<script lang="ts">
    import type { BinaryGateData } from "$lib/core";

    import { capitalise } from "$lib/flow/utils";
    import type { GateProps } from "$lib/flow/types";
    import { InputPin, OutputPin } from "$lib/flow/gates/pins";

    let { data, dragging, selected, parentId } : GateProps<BinaryGateData> = $props();

    const type = data.type.name;
    const connectable = !(!!parentId);
</script>

<div class={`core-gate color-${type}`} class:dragging class:selected>
    <InputPin id="in-1" label="in-1" enabled={data.in1} connectable={connectable} style="top: calc(var(--core-gate-height) / 2 - var(--handle-radius) * 1.5);" />
    <InputPin id="in-2" label="in-2" enabled={data.in2} connectable={connectable} style="top: calc(var(--core-gate-height) / 2 + var(--handle-radius) * 1.5);"  />
    <div>
        <b>{ capitalise(type) }</b>
    </div>
    <OutputPin id="out-1" label="out-1" connectable={connectable} enabled={data.out1} />
</div>
