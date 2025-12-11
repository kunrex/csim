<script lang="ts">
    import { setContext } from 'svelte';

    let { children } = $props();

    let selectedType = $state<string | null>(null);

    setContext('drag-drop', {
        get current() : string | null {
            return selectedType;
        },
        set current(value: string | null) {
            selectedType = value;
        }
    });
</script>

{@render children()}
