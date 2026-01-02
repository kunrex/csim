<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import type { InputGateData } from "$lib/core";

    import type { GateProps } from "$lib/flow/types";

    import { InputPin } from "$lib/flow/gates/pins";

    let { data, dragging, selected, parentId } : GateProps<InputGateData> = $props();

    const icon = data.ref.icon!;
    const type = data.ref.type.name;
    const connectable = !(!!parentId);
</script>

<div class={`icon-core-gate color-${type}`} class:dragging class:selected class:input={true}>
    <InputPin id="in-1" label="in-1" enabled={data.ref.in1} connectable={connectable} />
    <div>
        <b><FontAwesomeIcon icon={icon} /></b>
    </div>
</div>
