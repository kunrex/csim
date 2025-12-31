<script lang="ts">
    import type { SevenSegmentGateData } from "$lib/core";

    import type { GateProps } from "$lib/flow/types";
    import { InputPin, OutputPin } from "$lib/flow/gates/pins";
    import { SevenSegmentDisplay } from "$lib/flow/gates/display";

    let { data, dragging, selected, parentId } : GateProps<SevenSegmentGateData> = $props();

    const connectable = !(!!parentId);
</script>

<div class="seven-segment-display color-display" class:dragging class:selected>
    <InputPin id="in-1" label="in-1" style="top: 16%;" connectable={connectable} enabled={data.in1} />
    <InputPin id="in-2" label="in-2" style="top: 32%;" connectable={connectable} enabled={data.in2} />
    <InputPin id="in-3" label="in-3" style="top: 48%;" connectable={connectable} enabled={data.in3} />
    <InputPin id="in-4" label="in-4" style="top: 64%;" connectable={connectable} enabled={data.in4} />
    <InputPin id="in-5" label="in-5" style="top: 80%;" connectable={connectable} enabled={data.in5} />
    <SevenSegmentDisplay value={data.value} decimal={data.in5} />
    <OutputPin id="out-1" label="out-1" style="top: 16%;" connectable={connectable} enabled={data.in1} />
    <OutputPin id="out-2" label="out-2" style="top: 32%;" connectable={connectable} enabled={data.in2} />
    <OutputPin id="out-3" label="out-3" style="top: 48%;" connectable={connectable} enabled={data.in3} />
    <OutputPin id="out-4" label="out-4" style="top: 64%;" connectable={connectable} enabled={data.in4} />
    <OutputPin id="out-5" label="out-5" style="top: 80%;" connectable={connectable} enabled={data.in5} />
</div>
