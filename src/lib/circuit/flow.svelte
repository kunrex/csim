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
        type Viewport,
        type Connection, type NodeTypes, type EdgeTypes
    } from '@xyflow/svelte';
    import '@xyflow/svelte/dist/style.css'

    import {createEventDispatcher} from "svelte";

    import { nodeTypes } from "$lib";
    import {ConnectionData, type GateData, GateType} from "$lib/types";

    function onMove(e: MouseEvent | TouchEvent | null, viewport: Viewport) {
        x = viewport.x;
        y = viewport.y;
        zoom = viewport.zoom;
    }

    let x: number = 0, y: number = 0, zoom: number = 1;

    let nodes: Node[] = $state([]);
    let edges: Edge[] = $state([]);

    let i = 1;
    export function createGate(type: string, data: GateData) : string {
        const id = (i++).toString();
        const node: Node = {
            id: id,
            type: type,
            data: data,
            position: { x: (-x + window.innerWidth / 2) / zoom, y: (-y + window.innerHeight / 2) / zoom },
        }

        nodes = [...nodes, node];
        return id;
    }

    export const onDestroyGateCallback = createEventDispatcher<{ destroyed: string }>();
    export const onConnectionCallback = createEventDispatcher<{ connection: ConnectionData }>();
    export const onDisconnectionCallback = createEventDispatcher<{ disconnection: ConnectionData }>();
    export const onReconnectionCallback = createEventDispatcher<{ reconnection: { old: ConnectionData, new: ConnectionData } }>();

    function onConnection(connection: Connection) : void {
        if(connection.sourceHandle && connection.targetHandle)
            onConnectionCallback("connection", new ConnectionData(connection.source, connection.target, connection.sourceHandle, connection.targetHandle));
    }

    function onReconnection(edge: Edge, connection: Connection) : void {
        if(edge.sourceHandle && edge.targetHandle && connection.sourceHandle && connection.targetHandle)
            onReconnectionCallback("reconnection", {
                old: new ConnectionData(edge.source, edge.target, edge.sourceHandle, edge.targetHandle),
                new: new ConnectionData(connection.source, connection.target, connection.sourceHandle, connection.targetHandle)
            });
    }

    function onDelete(nodes: NodeTypes[], edges: EdgeTypes[]) : void {
        const edgeCount = edges.length;
        for(let i = 0; i < edgeCount; i++)
        {
            const edge = edges[i] as any;
            if(edge.sourceHandle && edge.targetHandle)
                onDisconnectionCallback("disconnection", new ConnectionData(edge.source, edge.target, edge.sourceHandle, edge.targetHandle));
        }

        const nodeCount = nodes.length;
        for(let i = 0; i < nodeCount; i++)
            onDestroyGateCallback("destroyed", (nodes[i] as any).id);
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
    <SvelteFlow onmove={onMove} onconnect={onConnection} onreconnect={onReconnection} ondelete={onDelete} connectionMode={ConnectionMode.Strict} bind:nodes={nodes} bind:edges={edges} {nodeTypes} fitView>
        <Controls />
        <Background bgColor="#1e1e1e" variant={BackgroundVariant.Dots} />
        <MiniMap bgColor="#1e1e1e"/>
    </SvelteFlow>
</div>