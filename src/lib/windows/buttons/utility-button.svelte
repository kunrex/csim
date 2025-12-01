<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

    export let action: string;
    export let onClick: () => void;
    export let fabIcon: IconDefinition;
</script>

<div class="utility-popup-parent group">
    <div class="utility-popup left-full top-1/2 -translate-y-1/2 md:-top-4 md:left-1/2 md:-translate-x-1/2 text-lg">
        { action }
    </div>
    <button class="utility-button" on:click={onClick}>
        <FontAwesomeIcon icon={fabIcon} />
    </button>
</div>
