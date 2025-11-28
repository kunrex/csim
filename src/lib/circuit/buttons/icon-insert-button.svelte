<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

    export let fabIcon: IconDefinition;
    export let color: string = "";
    export let onClick = () => {};
</script>

<button on:click={onClick} class={`${color} insert-button text-2xl`}>
    <b><FontAwesomeIcon icon={fabIcon}/></b>
</button>
