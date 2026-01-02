<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import type { UnaryGateData } from "$lib/core";

    import { capitalise } from "$lib/flow/utils.js";
    import type { GateProps } from "$lib/flow/types";

    import { InputPin, OutputPin } from "$lib/flow/gates/pins";

    let { data, dragging, selected, parentId } : GateProps<UnaryGateData> = $props();

    const type = data.ref.type.name;
    const connectable = !(!!parentId);
</script>

<div class={`core-gate color-${type}`} class:dragging class:selected>
    {#if !data.ref.hideInput }
        <InputPin id="in-1" label="in-1" enabled={data.ref.in1} connectable={connectable} />
    {/if}
    <div>
        {#if data.ref.icon }
            <FontAwesomeIcon icon={data.ref.icon} />
        {:else}
            <b>{ capitalise(type) }</b>
        {/if}
    </div>
    {#if !data.ref.hideOutput }
        <OutputPin id="out-1" label="out-1" enabled={data.ref.out1} connectable={connectable} />
    {/if}
</div>
