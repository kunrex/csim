<script lang="ts">
    import '@xyflow/svelte/dist/style.css'
    import { createEventDispatcher } from "svelte";
    import { SvelteFlow, Controls, Background, MiniMap, ConnectionMode, BackgroundVariant, type Edge, useSvelteFlow, type Viewport, type Connection, addEdge, type NodeTypes } from '@xyflow/svelte';

    import ELK from 'elkjs/lib/elk.bundled.js';

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
        fitView();
    }

    const { updateNode, updateEdge, fitView, setCenter } = useSvelteFlow();

    export function updateGate(id: string, gateData: GateData) : void {
        updateNode(id, (properties: any) => ({
            ...properties,
            data: gateData
        }));
    }

    function updateGatePosition(id: string, x: number, y: number) : void {
        updateNode(id, (properties: any) => ({
            ...properties,
            position: { x, y }
        }));
    }
    
    export function updateConnection(id: string, state: boolean) : void {
        updateEdge(id, (edge: any) => ({
            ...edge,
            animated: state
        }));
    }

    export function flowFitView() : void {
        fitView();
    }

    export function clearCircuit() : void {
        for(const gate of gates)
            onDestroyGateCallback("destroy", new CoreGateData(gate.id, gate.data.type));

        gates = [];
        connections = [];
        gateMap.clear();
    }

    export function flowFitGate(gateId: string) : void {
        const node = gateMap.get(gateId);
        if(!node)
            return;

        setCenter(node.position.x, node.position.y);
    }

    let localGateMap = new Map<string, string>();
    export function getCircuit() : CircuitData | null {
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

                const gate = gateMap.get(sourceId);
                if(gate)
                    gateData.set(relativeSource, new CircuitGateData(gate.data["type"], gate.data["name"]));
            }

            if(relativeTarget == undefined) {
                relativeTarget = gateData.size.toString();
                localGateMap.set(targetId, relativeTarget);

                const gate = gateMap.get(targetId);
                if(gate)
                    gateData.set(relativeTarget, new CircuitGateData(gate.data["type"], gate.data["name"]));
            }

            connectionData.push(new CoreConnectionData(relativeSource, relativeTarget, connection.sourceHandle!, connection.targetHandle!));
        }

        layerGates(gateData, connectionData)
        return new CircuitData(gateData, connectionData);
    }

    const elk = new ELK();
    const elkOptions = {
        'elk.algorithm': 'layered',
        'elk.layered.spacing.nodeNodeBetweenLayers': '100',
        'elk.spacing.nodeNode': '80',
    };

    export async function layout() : Promise<void> {
        const graph = {
            id: 'root',
            layoutOptions: elkOptions,
            children: gates.map((node) => ({
                id: node.id,
                x: node.position.x,
                y: node.position.y,
                width: node.width ?? 30,
                height: node.height ?? 30,
            })),
            edges: connections.map((connection) => ({
                id: connection.id,
                sources: [connection.source],
                targets: [connection.target],
            })),
        };

        console.log(graph);

        const layout = await elk
            .layout(graph)
            .then((layoutGraph) => ({
                gates: layoutGraph.children!.map((node) => ({
                    id: node.id,
                    position: { x: node.x, y: node.y },
                }))
            }));

        console.log(layout);

        for(const optimal of layout.gates)
            updateGatePosition(optimal.id, optimal.position.x, optimal.position.y);

        await fitView();
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
        if(targetNode && connection.targetHandle) {
            const data = targetNode.data;
            return !data["connections"][connection.targetHandle];
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
        <Background bgColor="#1e1e1e" variant={BackgroundVariant.Dots} />
        <MiniMap bgColor="#1e1e1e" position="top-right"/>
    </SvelteFlow>
</div>