<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import type { InputGateData } from "$lib/core";

    import { InputPin } from "$lib/flow/gates/pins";
    import type { GateProps } from "$lib/flow/types";

    let { data, dragging, selected, parentId } : GateProps<InputGateData> = $props();

    let icon = data.icon!;
    const connectable = !(!!parentId);
</script>

<div class={`icon-core-gate color-${data.type.name}`} class:dragging class:selected class:input={true}>
    <InputPin id="in-1" label="in-1" enabled={data.in1} connectable={connectable} />
    <div>
        <b><FontAwesomeIcon icon={icon} /></b>
    </div>
</div>
