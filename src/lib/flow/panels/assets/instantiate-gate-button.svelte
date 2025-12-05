<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

    import type { GateType } from "$lib/core";

    import { capitalise } from "$lib/flow/utils.js";

    const clickCallback = createEventDispatcher<{ create: GateType }>();
    function callback() : void {
        clickCallback("create", type);
    }

    export let color: string = "";
    export let type: GateType = "";
    export let disabled: boolean = false;
    export let fabIcon: IconDefinition | undefined = undefined;
</script>

<button on:click={callback} disabled={disabled} class={`${color} instantiate-gate-button`}>
    {#if fabIcon}
        <FontAwesomeIcon icon={fabIcon}/>
    {:else}
        <b>{ capitalise(type) }</b>
    {/if}
</button>
