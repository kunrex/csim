<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faExpand, faMaximize } from "@fortawesome/free-solid-svg-icons";

    import type { InspectorData } from "$lib/flow/panels/inspector/inspector-data";

    export let data: InspectorData;

    const editCallback = createEventDispatcher<{ edit: string }>();
    const peekCallback = createEventDispatcher<{ peek: string }>();
    const maximiseCallback = createEventDispatcher<{ maximise: string }>();

    function edit() : void {
        editCallback("edit", data.gate.id);
    }

    function peek() : void {
        peekCallback("peek", data.gate.id);
    }

    function maximise() : void {
        maximiseCallback("maximise", data.gate.id);
    }
</script>

<div class={`flex flex-row items-center gap-2 pl-[${data.depth}]`}>
    <FontAwesomeIcon icon={data.fabIcon} />
    <div class="flex-1 overflow-x-scroll">
        <input class="input-clean w-full" type="text" disabled={data.depth > 0 || !data.focused} size="16" minlength="0" maxlength="16" bind:value={data.gate.data["name"]}>
    </div>
    <button class="inspector-utility-button" disabled={!data.focused || data.gate.type !== "prefab"} on:click={peek}>
        <FontAwesomeIcon icon={faExpand} />
    </button>
    <button class="inspector-utility-button" on:click={maximise} disabled={!data.focused}>
        <FontAwesomeIcon icon={faMaximize} />
    </button>
</div>