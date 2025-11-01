<script lang="ts">
    import {
        SvelteFlow,
        Controls,
        Background,
        MiniMap,
        ConnectionMode,
        BackgroundVariant,
        type Edge,
        type Node,
        useSvelteFlow,
    } from '@xyflow/svelte';
    import '@xyflow/svelte/dist/style.css'

    import { nodeTypes } from "$lib/index";

    let x: number = 0, y: number = 0, zoom: number = 1;

    let nodes: Node[] = $state([]);
    let edges: Edge[] = $state([]);

    let i = 1;
    export function addNode(type: string): string {
        const id = (i++).toString();

        const node: Node = {
            id: id,
            type: type,
            data: { },
            position: { x: (-x + window.innerWidth / 2) / zoom, y: (-y + window.innerHeight / 2) / zoom },
        }

        nodes = [...nodes, node];
        return id;
    }
</script>

<style>
    :global(.svelte-flow__handle) {
        width: 14px;
        height: 14px;
        border: 2px solid #1e1e1e;
        border-radius: 50%;
    }

    :global(.svelte-flow__handle.target) {
        background-color: dimgray;
    }

    :global(.svelte-flow__handle.source) {
        background-color: slategray;
    }

    :global(.svelte-flow__edge.selected) {
        stroke: darkslategray;
    }

    :global(.svelte-flow__edge-path) {
        stroke: lightslategray;
        stroke-width: 2px;
    }

    :global(.svelte-flow__edge.animated .svelte-flow__edge-path) {
        stroke: red;
        stroke-width: 2px;
    }
</style>

<div style="height: 100vh; width: 100vw;">
    <SvelteFlow onmove={(e, viewport) => {
        x = viewport.x;
        y = viewport.y;
        zoom = viewport.zoom;

        console.log(x, y, zoom);
    }} connectionMode={ConnectionMode.Strict} bind:nodes={nodes} bind:edges={edges} {nodeTypes} fitView>
        <Controls />
        <Background bgColor="#1e1e1e" variant={BackgroundVariant.Dots} />
        <MiniMap bgColor="#1e1e1e"/>
    </SvelteFlow>
</div>