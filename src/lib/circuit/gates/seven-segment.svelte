<script lang="ts">
    import type { GateData } from "$lib/logic";

    import { InputHandle } from "$lib/circuit/handles";
    import { SevenSegmentDisplay } from "$lib/circuit/display";

    export let data: GateData;
    export let dragging = false;
    export let selected = false;
</script>

<div class="seven-segment-display color-display" class:dragging class:selected>
    <InputHandle id="in-1" style="top: 16%;" enabled={data["in-1"]} connected={data["in-1-connected"]}/>
    <InputHandle id="in-2" style="top: 32%;" enabled={data["in-2"]} connected={data["in-2-connected"]}/>
    <InputHandle id="in-3" style="top: 48%;" enabled={data["in-3"]} connected={data["in-3-connected"]}/>
    <InputHandle id="in-4" style="top: 64%;" enabled={data["in-4"]} connected={data["in-4-connected"]}/>
    <InputHandle id="in-5" style="top: 80%;" enabled={data["in-5"]} connected={data["in-5-connected"]}/>
    <SevenSegmentDisplay value={data["value"]} decimal={data["in-5"]}/>
</div>
