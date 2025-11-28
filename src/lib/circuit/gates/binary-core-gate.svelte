<script lang="ts">
    import type { GateData } from "$lib/logic";

    import { InputHandle, OutputHandle } from "$lib/circuit/handles";

    export let data: GateData;
    export let dragging = false;
    export let selected = false;

    const gate = data["gate"] as string;
    const color = data["color"] as string;
</script>

<div class={`core-gate ${color}`} class:dragging class:selected>
    <InputHandle id="in-1" style="top: calc(var(--core-gate-height) / 2 - var(--handle-radius) * 1.5);" enabled={data["in-1"]}/>
    <InputHandle id="in-2" style="top: calc(var(--core-gate-height) / 2 + var(--handle-radius) * 1.5);" enabled={data["in-2"]} />
    <div>
        <b>{ gate }</b>
    </div>
    <OutputHandle id="out-1" enabled={data['out-1']}/>
</div>
