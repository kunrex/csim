<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import type { OutputGateData } from "$lib/core";

    import type { GateProps } from "$lib/flow/types";
    import { OutputPin } from "$lib/flow/gates/pins";

    let { data, dragging, selected, parentId } : GateProps<OutputGateData> = $props();

    const icon = data.icon!;
    const toggle = data.toggle!;
    const connectable = !(!!parentId);
</script>

<button onclick={toggle} class={`icon-core-gate color-${data.type.name}`} class:dragging class:selected class:output={true}>
    <b><FontAwesomeIcon icon={icon} /></b>
    <OutputPin id="out-1" label="out-1" enabled={data.out1} connectable={connectable} />
</button>
