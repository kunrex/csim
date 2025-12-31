<script lang="ts">
    import { setContext } from 'svelte';

    import type { GateType } from "$lib/core";

    let { children } = $props();

    let selectedType = $state.raw<GateType | null>(null);

    setContext('drag-drop', {
        get current() : GateType | null {
            return selectedType;
        },
        set current(value: GateType | null) {
            selectedType = value;
        }
    });
</script>

{@render children()}
