<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

    export let fabIcon: IconDefinition;
    export let color: string = "";
    export let onClick = () => {};
</script>

<button on:click={onClick} class="node hover:cursor-pointer hover:opacity-80" style="background-color: { color };">
    <div class="text-2xl text-center">
        <b><FontAwesomeIcon icon={fabIcon}/></b>
    </div>
</button>
