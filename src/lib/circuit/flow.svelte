<script lang="ts">
    import '@xyflow/svelte/dist/style.css'
    import { createEventDispatcher } from "svelte";
    import { SvelteFlow, Controls, Background, MiniMap, ConnectionMode, BackgroundVariant, type Edge, useSvelteFlow, type Viewport, type Connection, addEdge, type NodeTypes } from '@xyflow/svelte';

    import { Gate, type GateData } from "$lib/logic";

    import { createEdge, layerGates } from "$lib/circuit/utils";
    import {
        InputGate,
        OutputGate,
        UnaryCoreGate,
        BinaryCoreGate,
        PrefabGate,
        SevenSegment
    } from "$lib/circuit/gates";
    import { ConnectionData, CoreGateData, type GateNodeType, CircuitData, CoreConnectionData, CircuitGateData, type GateNode } from "$lib/circuit/types";

    export const onDestroyGateCallback = createEventDispatcher<{ destroy: CoreGateData }>();
    export const onConnectionCallback = createEventDispatcher<{ connection: ConnectionData }>();
    export const onDisconnectionCallback = createEventDispatcher<{ disconnection: ConnectionData }>();

    let x = 0, y = 0, zoom = 1;
    function onMove(e: MouseEvent | TouchEvent | null, viewport: Viewport) {
        x = viewport.x;
        y = viewport.y;
        zoom = viewport.zoom;
    }

    const nodeTypes: NodeTypes = {
        "s-input": InputGate,
        "s-output": OutputGate,
        "prefab": PrefabGate,
        "unary": UnaryCoreGate,
        "display": SevenSegment,
        "binary": BinaryCoreGate,
    };

    let gates: GateNode[] = $state([]);
    let connections: Edge[] = $state([]);

    let gateMap = new Map<string, GateNode>();

    export function createGate(type: GateNodeType, gate: Gate) : void {
        const node: GateNode = {
            id: gate.id,
            type: type,
            data: gate.gateData,
            position: { x: (-x + window.innerWidth / 2) / zoom, y: (-y + window.innerHeight / 2) / zoom },
        };

        gateMap.set(gate.id, node);
        gates = [...gates, node];
    }

    const { updateNode, updateEdge } = useSvelteFlow();

    export function updateGate(id: string, gateData: GateData) : void {
        updateNode(id, (properties: any) => ({
            ...properties,
            data: gateData
        }));
    }
    
    export function updateConnection(id: string, state: boolean) : void {
        updateEdge(id, (edge: any) => ({
            ...edge,
            animated: state
        }));
    }

    export function clearCircuit() : void {
        gates = [];
        connections = [];
        gateMap.clear();
    }

    let localGateMap = new Map<string, string>();
    export function getCircuit() : CircuitData {
        localGateMap.clear();

        const gateData = new Map<string, CircuitGateData>();
        const connectionData: CoreConnectionData[] = [];

        const edgeCount = connections.length;
        for(let i = 0; i < edgeCount; i++) {
            const connection = connections[i];
            const sourceId = connection.source;
            const targetId = connection.target;

            let relativeSource = localGateMap.get(sourceId), relativeTarget = localGateMap.get(targetId);
            if(relativeSource == undefined) {
                relativeSource = gateData.size.toString();
                localGateMap.set(sourceId, relativeSource);
                gateData.set(relativeSource, new CircuitGateData(gateMap.get(sourceId)!.data.type));
            }

            if(relativeTarget == undefined) {
                relativeTarget = gateData.size.toString();
                localGateMap.set(targetId, relativeTarget);
                gateData.set(relativeTarget, new CircuitGateData(gateMap.get(targetId)!.data.type));
            }

            connectionData.push(new CoreConnectionData(relativeSource, relativeTarget, connection.sourceHandle!, connection.targetHandle!));
        }

        layerGates(gateData, connectionData);
        return new CircuitData(gateData, connectionData);
    }

    function onConnection(connection: Connection) : void {
        if(connection.sourceHandle && connection.targetHandle) {
            const edge = createEdge(connection);
            connections = addEdge(edge, connections);
            onConnectionCallback("connection", new ConnectionData(edge.id, connection.source, connection.target, connection.sourceHandle, connection.targetHandle));
        }
    }

    function onDelete(details: { nodes: GateNode[]; edges: Edge[]; }) : void {
        const edges = details.edges;
        const nodes = details.nodes;

        const edgeCount = edges.length;
        for(let i = 0; i < edgeCount; i++) {
            const edge = edges[i];
            if(edge.sourceHandle && edge.targetHandle)
                onDisconnectionCallback("disconnection", new ConnectionData(edge.id, edge.source, edge.target, edge.sourceHandle, edge.targetHandle));
        }

        const nodeCount = nodes.length;
        for(let i = 0; i < nodeCount; i++) {
            const node = nodes[i]
            gateMap.delete(node.id);
            onDestroyGateCallback("destroy", new CoreGateData(node.id, node.data.type));
        }
    }

    function isValidConnection(connection: Connection | Edge) : boolean {
        const targetNode = gateMap.get(connection.target);
        if(targetNode) {
            const data = targetNode.data;
            return !data[`${connection.targetHandle}-connected`];
        }

        return false;
    }
</script>

<style>
    :global(.svelte-flow__handle) {
        width: calc(var(--handle-radius) * 2);
        height: calc(var(--handle-radius) * 2);

        border-width: 2px;
        border-radius: 50%;
        border-style: solid;
        border-color: #1e1e1e;
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
        stroke-width: 2px;
        stroke: lightslategray;
    }

    :global(.svelte-flow__edge.animated .svelte-flow__edge-path) {
        stroke: red;
    }
</style>

<div class="w-screen h-screen">
    <SvelteFlow onmove={onMove} onconnect={onConnection} ondelete={onDelete} isValidConnection={isValidConnection} connectionMode={ConnectionMode.Strict} bind:nodes={gates} bind:edges={connections} {nodeTypes} fitView>
        <Controls />
        <Background bgColor="#1e1e1e" variant={BackgroundVariant.Dots} />
        <MiniMap bgColor="#1e1e1e"/>
    </SvelteFlow>
</div>