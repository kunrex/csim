<script lang="ts">
    import { SvelteFlow, Controls, Background, MiniMap, ConnectionMode, BackgroundVariant, type Edge, type Node } from '@xyflow/svelte';
    import '@xyflow/svelte/dist/style.css'

    import { And, Nand, Not, Or, Nor, Xor, Xnor } from "$lib";

    let nodes: Node[] = $state.raw([
        {
            id: '1',
            type: 'nor',
            data: { label: 'Hello' },
            position: { x: 0, y: 0 }
        },
        {
            id: '2',
            type: 'nand',
            data: { label: 'World' },
            position: { x: 200, y: 0 }
        },
        {
            id: '3',
            type: 'or',
            data: { label: 'World' },
            position: { x: 100, y: 150 }
        },
        {
            id: '4',
            type: 'and',
            data: { label: 'World' },
            position: { x: 200, y: 150 }
        }
    ]);

    let edges: Edge[] = $state.raw([
        {
            id: '1-3',
            source: '1',
            target: '3',
            animated: false
        },
        {
            id: '2-3',
            source: '2',
            target: '3',
            animated: true
        }
    ]);

    const nodeTypes = {
        and: And,
        nand: Nand,
        not: Not,
        or: Or,
        nor: Nor,
        xor: Xor,
        Xnor: Xnor
    }
</script>

<style>
    :global(.svelte-flow__handle) {
        width: 14px;
        height: 14px;
        border: 2px solid white;
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

<div style="height:100vh">
    <SvelteFlow connectionMode={ConnectionMode.Strict} bind:nodes bind:edges {nodeTypes} fitView>
        <Controls />
        <Background bgColor="#fff3dc" variant={BackgroundVariant.Dots} />
        <MiniMap />
    </SvelteFlow>
</div>