<script lang="ts">
    import type { UnaryGateData } from "$lib/core";

    import { capitalise } from "$lib/flow/utils.js";
    import type { GateProps } from "$lib/flow/types";
    import { InputPin, OutputPin } from "$lib/flow/gates/pins";
    import {FontAwesomeIcon} from "@fortawesome/svelte-fontawesome";

    let { data, dragging, selected, parentId } : GateProps<UnaryGateData> = $props();

    const type = data.type.name;
    const connectable = !(!!parentId);
</script>

<div class={`core-gate color-${type}`} class:dragging class:selected>
    {#if !data.hideInput }
        <InputPin id="in-1" label="in-1" enabled={data.in1} connectable={connectable} />
    {/if}
    <div>
        {#if data.icon }
            <FontAwesomeIcon icon={data.icon} />
        {:else}
            <b>{ capitalise(type) }</b>
        {/if}
    </div>
    {#if !data.hideOutput }
        <OutputPin id="out-1" label="out-1" enabled={data.out1} connectable={connectable} />
    {/if}
</div>
