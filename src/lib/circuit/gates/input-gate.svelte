<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

    import type { GateData } from "$lib/logic";

    import { InputHandle } from "$lib/circuit/handles";

    export let data: GateData;
    export let dragging = false;
    export let selected = false;

    let color = data["color"] as string;
    let icon = data["icon"] as IconDefinition;
</script>

<div class={`icon-core-gate ${color}`} style={color} class:dragging class:selected>
    <InputHandle id="in-1" enabled={data["in-1"]}/>
    <div>
        <b><FontAwesomeIcon icon={icon}/></b>
    </div>
</div>
