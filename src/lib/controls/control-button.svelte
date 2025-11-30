<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

    export let onClick: () => void;
    export let fabIcon: IconDefinition;
</script>

<button class="control-button" on:click={onClick}>
    <FontAwesomeIcon icon={fabIcon}></FontAwesomeIcon>
</button>