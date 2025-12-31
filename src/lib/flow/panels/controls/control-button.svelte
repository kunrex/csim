<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

    interface ControlButtonProps {
        action: string,
        disabled?: boolean,
        onclick: () => void,
        fabIcon: IconDefinition,
    }

    let { action, disabled = false, onclick, fabIcon } : ControlButtonProps = $props();
    let icon = $derived(fabIcon);
</script>

<div class="utility-popup-parent group">
    <div class="utility-popup left-full top-1/2 -translate-y-1/2 md:-top-4 md:left-1/2 md:-translate-x-1/2 text-lg">
        { action }
    </div>
    <button class="utility-button" onclick={onclick} disabled={disabled}>
        <FontAwesomeIcon icon={icon} />
    </button>
</div>
