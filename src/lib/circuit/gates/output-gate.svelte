<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

    import type { GateData } from "$lib/logic";

    import { OutputHandle } from "$lib/circuit/handles";

    export let data: GateData;
    export let dragging = false;
    export let selected = false;

    const color = data["color"] as string;
    const icon = data["icon"] as IconDefinition;

    const toggle = data["toggle"] as () => void;
</script>

<button on:click={() => { toggle(); }} class={`icon-core-gate ${color}`} class:dragging class:selected>
    <b><FontAwesomeIcon icon={icon}/></b>
    <OutputHandle id="out-1" enabled={data["out-1"]}/>
</button>
