<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
    import { faMaximize, faPencil } from "@fortawesome/free-solid-svg-icons";

    import { Gate } from "$lib/logic";

    import { checkEditable } from "$lib/windows/inspector/utils";

    export let gate: Gate;
    export let fabIcon: IconDefinition;
    export let onEdit: (gateId: string) => void;
    export let onMaximise: (gateId: string) => void;
</script>

<div class="flex flex-row items-center gap-2">
    <FontAwesomeIcon icon={fabIcon} />
    <div class="flex-1 overflow-x-scroll">
        <input class="input-clean w-full" type="text" minlength="0" maxlength="16" bind:value={gate.gateData["name"]}>
    </div>
    <button class="inspector-utility-button" disabled={checkEditable(gate.gateType())} on:click={() => { onEdit(gate.id); }}>
        <FontAwesomeIcon icon={faPencil} />
    </button>
    <button class="inspector-utility-button" on:click={() => { onMaximise(gate.id); }}>
        <FontAwesomeIcon icon={faMaximize} />
    </button>
</div>