<script lang="ts">
    import { SvelteFlow, Controls, Background, MiniMap, ConnectionMode, BackgroundVariant, type Edge, type Node, useSvelteFlow, type Viewport, type Connection, addEdge } from '@xyflow/svelte';
    import '@xyflow/svelte/dist/style.css'

    import { createEventDispatcher } from "svelte";

    import { createEdge } from "$lib/circuit/utils";
    import { nodeTypes, ConnectionData, type GateData, type GateDeleteData, type GateType, type OnDeleteParams } from "$lib/circuit";

    const { updateNode, updateEdge } = useSvelteFlow();
    export const updateNodeFunction = updateNode;
    export const updateEdgeFunction = updateEdge;

    export const onDestroyGateCallback = createEventDispatcher<{ destroy: GateDeleteData }>();
    export const onConnectionCallback = createEventDispatcher<{ connection: ConnectionData }>();
    export const onDisconnectionCallback = createEventDispatcher<{ disconnection: ConnectionData }>();

    let x = 0, y = 0, zoom = 1;
    function onMove(e: MouseEvent | TouchEvent | null, viewport: Viewport) {
        x = viewport.x;
        y = viewport.y;
        zoom = viewport.zoom;
    }

    let gates: Node[] = $state([]);
    let connections: Edge[] = $state([]);

    let gateCount = 1;
    export function createGate(type: GateType, data: GateData) : string {
        const id = (gateCount++).toString();
        const node: Node = {
            id: id,
            type: type as string,
            data: data,
            position: { x: (-x + window.innerWidth / 2) / zoom, y: (-y + window.innerHeight / 2) / zoom },
        }

        gates = [...gates, node];
        return id;
    }

    function onConnection(connection: Connection) : void {
        if(connection.sourceHandle && connection.targetHandle) {
            const edge = createEdge(connection);
            connections = addEdge(edge, connections);
            onConnectionCallback("connection", new ConnectionData(edge.id, connection.source, connection.target, connection.sourceHandle, connection.targetHandle));
        }
    }

    function onDelete(details: OnDeleteParams) : void {
        const edges = details.edges;
        const nodes = details.nodes;

        const edgeCount = edges.length;
        for(let i = 0; i < edgeCount; i++)
        {
            const edge = edges[i] as any;
            if(edge.sourceHandle && edge.targetHandle)
                onDisconnectionCallback("disconnection", new ConnectionData(edge.id, edge.source, edge.target, edge.sourceHandle, edge.targetHandle));
        }

        const nodeCount = nodes.length;
        for(let i = 0; i < nodeCount; i++) {
            const node = nodes[i] as any;
            onDestroyGateCallback("destroy", { id: node.id, type: node.type });
        }
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
    <SvelteFlow onmove={onMove} onconnect={onConnection} ondelete={onDelete} connectionMode={ConnectionMode.Strict} bind:nodes={gates} bind:edges={connections} {nodeTypes} fitView>
        <Controls />
        <Background bgColor="#1e1e1e" variant={BackgroundVariant.Dots} />
        <MiniMap bgColor="#1e1e1e"/>
    </SvelteFlow>
</div>