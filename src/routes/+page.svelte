<script lang="ts">
    import { Simulation, Splashscreen } from "$lib";

    import { onMount } from "svelte";

    const minWidth = 800;
    const minHeight = 600;

    let show = $state.raw(false);
    function onWindowResize() {
        const width = window.innerWidth
        const height = window.innerHeight
        show = width < minWidth || height < minHeight;
    }

    onMount(() => {
        window.onresize = () => {
            onWindowResize();
        };

        onWindowResize();
    });
</script>

<Simulation />
{#if show}
    <Splashscreen />
{/if}