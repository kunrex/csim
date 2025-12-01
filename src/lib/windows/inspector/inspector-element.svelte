<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

    import { Gate } from "$lib/logic";

    export let gate: Gate;
    export let fabIcon: IconDefinition;
</script>

<div class="flex flex-row items-center gap-2 my-1 inspector-element">
    <FontAwesomeIcon icon={fabIcon}/>
    <input class="input-clean" type="text" minlength="0" maxlength="32" bind:value={gate.gateData["name"]}>
</div>