<script lang="ts">
    import '@xyflow/svelte/dist/style.css'
    import {
        SvelteFlow,
        MiniMap,
        Background,
        ConnectionMode,
        BackgroundVariant,
        useSvelteFlow,
        type Connection,
        addEdge,
        type NodeTypes,
        type EdgeTypes,
        Panel,
        getConnectedEdges,
        useNodesInitialized, useUpdateNodeInternals, type FitViewOptions, ConnectionLineType
    } from '@xyflow/svelte';

    import { faCode, faCube, faExpand, faLayerGroup, faRobot, faTrashCan } from "@fortawesome/free-solid-svg-icons";

    import type {ElkLayoutOptionDescription, ElkNode} from "elkjs";
    import ELK from 'elkjs/lib/elk.bundled.js';
    import type { LayoutOptions } from 'elkjs';

    import {type GateData, type GateType, type PrefabGateData, type WireData} from "$lib/core";

    import { Wire, InternalWire } from "$lib/flow/wires";
    import { useDragDrop } from "$lib/flow/drag-drop";
    import { Assets, Control, Inspector } from "$lib/flow/panels";
    import { constructElkGraph, convertElkConnections } from "$lib/flow/utils";
    import { InputGate, OutputGate, UnaryCoreGate, BinaryCoreGate, PrefabGate, SevenSegment } from "$lib/flow/gates";
    import { ConnectionData, CoreConnectionData, type GateNode, type WireEdge, CreateGateData, CreateGateCallback, WireWrapper, CircuitBlueprint, CircuitGateData, GateWrapper } from "$lib/flow/types";
    import {tick} from "svelte";
    import {prefabHandleGap} from "$lib/flow/constants";

    interface FlowProps {
        destroyGateCallback: (gateId: string) => void;
        createGateCallback: (createGateData: CreateGateData) => void;

        connectionCallback: (connectionData: CoreConnectionData) => void;
        disconnectionCallback: (disconnectionData: ConnectionData) => void;

        prefabCreationCallback: (circuit: CircuitBlueprint) => void;
    }

    interface OnDeleteParams {
        nodes: GateNode[];
        edges: WireEdge[];
    }

    let { destroyGateCallback, createGateCallback, connectionCallback, disconnectionCallback, prefabCreationCallback } : FlowProps = $props();

    const nodeTypes: NodeTypes = {
        "prefab": PrefabGate,

        "s-input": InputGate,
        "s-output": OutputGate,

        "display": SevenSegment,

        "unary": UnaryCoreGate,
        "binary": BinaryCoreGate,
    };

    const edgeTypes: EdgeTypes = {
        "wire": Wire,
        "internal": InternalWire
    }

    let assets: Assets;
    let inspector: Inspector;

    let focused = $state(false);

    let wires: WireEdge[] = $state([]);
    let gates: GateNode[] = $state([]);

    const gateMap = new Map<string, GateNode>();

    const elk = new ELK();
    const elkOptions: LayoutOptions = {
        'elk.algorithm': 'layered',
        'elk.spacing.nodeNode': '100',
        'elk.layered.spacing.nodeNodeBetweenLayers': '120',
    };

    const { fitView, setCenter, screenToFlowPosition } = useSvelteFlow();

    const fitOptions: FitViewOptions = {
        padding: 0.2,
        duration: 300,
        interpolate: "smooth"
    };

    const type = useDragDrop();
    function onDragOver(event: DragEvent) : void {
        event.preventDefault();

        if (event.dataTransfer)
            event.dataTransfer.dropEffect = 'move';
    }

    function onDrop(event: DragEvent) : void {
        event.preventDefault();

        if (!type.current)
            return;

        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        createGateCallback(new CreateGateData(type.current, position.x, position.y));
        type.current = null;
    }

    function addNode(node: GateNode) : void {
        gateMap.set(node.id, node);
        gates = [...gates, node];

        inspector.addGate(node);
    }

    function instantiateInternalConnections(wrapper: GateWrapper) {
        if(!wrapper.connections)
            return;

        for(const connection of wrapper.connections) {
            const wire: WireEdge = {
                id: connection.connectionData.id,
                type: "internal",
                data: connection.wireData,
                animated: connection.wireData.state,

                hidden: true,
                deletable: false,
                selectable: true,

                source: connection.connectionData.source,
                target: connection.connectionData.target,
                sourceHandle: connection.connectionData.sourceHandle,
                targetHandle: connection.connectionData.targetHandle
            };

            wires = addEdge(wire, wires);
        }
    }

    function instantiateChildGates(wrapper: GateWrapper) {
        if(!wrapper.children)
            return;

        for(const child of wrapper.children) {
            const childNode: GateNode = {
                id: child.id,
                type: child.nodeType,
                data: child.gateData,

                extent: undefined,
                parentId: wrapper.id,
                position: { x: 0, y: 0 },

                hidden: true,
                deletable: false,
                selectable: true,

                measured: undefined
            };

            if(childNode.type == "prefab") {
                const data = wrapper.gateData as PrefabGateData;
                childNode.width = prefabHandleGap * (Math.max(data.clockCount, data.displayCount) + 2);
                childNode.height = prefabHandleGap * (Math.max(data.powerCount, data.probeCount) + 2);
            }

            addNode(childNode);

            if(childNode.type == "prefab")
                instantiatePrefabInternals(child);
        }
    }

    function instantiatePrefabInternals(wrapper: GateWrapper) {
        instantiateChildGates(wrapper);
        instantiateInternalConnections(wrapper);
    }

    export function instantiateGateCallback(createCallback: CreateGateCallback) : void {
        const node: GateNode = {
            id: createCallback.gate.id,
            type: createCallback.gate.nodeType,
            data: createCallback.gate.gateData,

            extent: undefined,
            parentId: undefined,
            position: { x: createCallback.creation.x, y: createCallback.creation.y },

            hidden: false,
            deletable: true,
            selectable: true,

            measured: undefined
        };

        if(node.type == "prefab") {
            const data = createCallback.gate.gateData as PrefabGateData;
            node.width = prefabHandleGap * (Math.max(data.clockCount, data.displayCount) + 2);
            node.height = prefabHandleGap * (Math.max(data.powerCount, data.probeCount) + 2);
        }

        addNode(node);

        if(node.type == "prefab")
            instantiatePrefabInternals(createCallback.gate);
    }

    export function instantiateWireCallback(createCallback: WireWrapper) : void {
        const wire: WireEdge = {
            id: createCallback.connectionData.id,
            type: "wire",
            data: createCallback.wireData,
            animated: createCallback.wireData.state,

            hidden: false,
            deletable: true,
            selectable: true,

            source: createCallback.connectionData.source,
            target: createCallback.connectionData.target,
            sourceHandle: createCallback.connectionData.sourceHandle,
            targetHandle: createCallback.connectionData.targetHandle
        };

        wires = addEdge(wire, wires);
    }

    export function updateGateData(id: string, gateData: GateData) : void {
        const gate = gateMap.get(id);
        if(!gate)
            return;

        gates = gates.map((node: GateNode) => {
            if(id != node.id)
                return node;

            const newNode = {
                ...node,
                data: gateData
            };

            gateMap.set(id, newNode);
            return newNode;
        });
    }

    export function updateWireData(id: string, wireData: WireData) : void {
        wires = wires.map((wire: WireEdge) => wire.id == id ? {
                ...wire,
                data: wireData,
                animated: wireData.state
            } : wire
        );
    }

    export function addPrefabOption(type: GateType) : void {
        assets.addPrefabOption(type);
    }

    function layoutGate(elkNode: ElkNode, rearrangedGates: Map<string, GateNode>) {
        const gate = gateMap.get(elkNode.id)
        if(!gate)
            return;

        const newNode = {  ...gate };
        newNode.position = { x: elkNode.x!, y: elkNode.y! };
        if(gate.type == "prefab" && (gate.data as PrefabGateData).expanded) {
            newNode.width = elkNode.width;
            newNode.height = elkNode.height;
        }

        gateMap.set(gate.id, newNode);
        rearrangedGates.set(gate.id, newNode);

        for(const child of elkNode.children!)
            layoutGate(child, rearrangedGates);
    }

    async function waitForNodeDimensions() : Promise<boolean> {
        for (let i = 0; i < 10; i++) {
            await new Promise(r => requestAnimationFrame(r));

            let flag = false;
            for(const gate of gates)
                if(!gate.hidden && !gate.measured) {
                    flag = true;
                    break;
                }

            if(!flag)
                return true;
        }

        return false;
    }

    const rearrangedGates = new Map<string, GateNode>();
    async function rearrangeLayout() : Promise<void> {
        rearrangedGates.clear();

        const graph = {
            id: 'root',
            layoutOptions: elkOptions,
            children: constructElkGraph(gates),
            edges: convertElkConnections(wires)
        };

        const layout = await elk.layout(graph).then((layoutGraph) => ({
            gates: layoutGraph.children!
        }));

        for(const gate of layout.gates)
            layoutGate(gate, rearrangedGates);

        gates = gates.map((node: GateNode) => {
            const rearranged = rearrangedGates.get(node.id);
            return rearranged ?? node;
        });

        await fitView();
    }

    function manageWires() : void {
        wires = wires.map((wire: WireEdge) => {
            const source = gateMap.get(wire.source);
            const target = gateMap.get(wire.target);

            let hidden = !source || !target || source.hidden || target.hidden;
            return wire.hidden == hidden ? wire : {
                ...wire,
                hidden: hidden,
            };
        });
    }

    async function expandGate(gateId: string) : Promise<void> {
        const target = gateMap.get(gateId);
        if(!target || target.type != "prefab")
            return;

        const data = target.data as PrefabGateData;
        if(data.expanded)
            return;

        data.expanded = true;

        gates = gates.map((node: GateNode) => {
            if(node.parentId == gateId)
            {
                const newNode: GateNode = {
                    ...node,
                    hidden: false,
                    extent: 'parent',
                }

                console.log(node);

                gateMap.set(node.id, newNode);
                return newNode;
            }

            return node;
        });

        await tick();
        const proceed = await waitForNodeDimensions();

        if(proceed) {
            manageWires();
            await rearrangeLayout();
        } else {
            await resetGates();
        }
    }

    async function resetGates() : Promise<void> {
        gates = gates.map((node: GateNode) => {
            if(node.hidden)
                return node;

            const newNode = { ...node };
            if(node.type == "prefab") {
                const data = newNode.data as PrefabGateData;

                data.expanded = false;
                newNode.width = prefabHandleGap * (Math.max(data.clockCount, data.displayCount) + 2);
                newNode.height = prefabHandleGap * (Math.max(data.powerCount, data.probeCount) + 2);
            }

            if(newNode.parentId) {
                newNode.hidden = true;
                newNode.extent = undefined;
                newNode.position = { x: 0, y: 0 };
            }

            gateMap.set(node.id, newNode);
            return newNode;
        });

        await tick();
        await waitForNodeDimensions();

        manageWires();
    }

    async function refocusHandler() : Promise<void> {
        await resetGates();
    }

    async function expandGateHandler(gateId: string) : Promise<void> {
        await expandGate(gateId);
    }

    function maximiseGateHandler(gateId: string) {
        const node = gateMap.get(gateId);
        if(!node)
            return;

        setCenter(node.position.x, node.position.y);
    }

    function deleteGateHandler(gateId: string) : void {
        const node = gateMap.get(gateId);
        if(!node)
            return;

        gates = gates.map((node: GateNode) => {

        });

        gateMap.delete(node.id);
        inspector.removeGate(node.id);

        destroyGateCallback(node.id);
    }

    function clearCircuitHandler() : void {
        for(const gate of gates)
            deleteGateHandler(gate.id);

        gates = [];
        wires = [];
        gateMap.clear();
    }

    let localGateMap = new Map<string, string>();
    function generateCircuitDataHandler() : void {
        localGateMap.clear();

        const gateData = new Map<string, CircuitGateData>();
        const connectionData: CoreConnectionData[] = [];

        const edgeCount = wires.length;
        for(let i = 0; i < edgeCount; i++) {
            const connection = wires[i];
            if(connection.type == "internal")
                continue;

            const sourceId = connection.source;
            const targetId = connection.target;

            let relativeSource = localGateMap.get(sourceId), relativeTarget = localGateMap.get(targetId);
            if(relativeSource == undefined) {
                relativeSource = gateData.size.toString();
                localGateMap.set(sourceId, relativeSource);

                const gate = gateMap.get(sourceId);
                if(gate)
                    gateData.set(relativeSource, new CircuitGateData(gate.data.type, gate.data.name));
            }

            if(relativeTarget == undefined) {
                relativeTarget = gateData.size.toString();
                localGateMap.set(targetId, relativeTarget);

                const gate = gateMap.get(targetId);
                if(gate)
                    gateData.set(relativeTarget, new CircuitGateData(gate.data.type, gate.data.name));
            }

            connectionData.push(new CoreConnectionData(relativeSource, relativeTarget, connection.sourceHandle!, connection.targetHandle!));
        }

        prefabCreationCallback(new CircuitBlueprint(gateData, connectionData));
    }

    function onConnection(connection: Connection) : false {
        if(connection.sourceHandle && connection.targetHandle)
            connectionCallback(new CoreConnectionData(connection.source, connection.target, connection.sourceHandle, connection.targetHandle));

        return false;
    }

    function onReconnection(oldWire: WireEdge, newWire: Connection) : void {
        if(oldWire.sourceHandle && oldWire.targetHandle) {
            disconnectionCallback(new ConnectionData(oldWire.id, oldWire.source, oldWire.target, oldWire.sourceHandle, oldWire.targetHandle));
            onConnection(newWire);
        }
    }

    function onBeforeDelete(params: OnDeleteParams) : Promise<boolean | OnDeleteParams> {
        const nodes = [...params.nodes];
        const edges = [...params.edges];

        for(const gate of gates) {
            if(nodes.some((node) => node.id == gate.id) || !gate.parentId)
                continue;

            if(nodes.some((node) => node.id == gate.parentId))
                nodes.push(gate);
        }

        for(const wire of wires) {
            if(edges.some((edge) => edge.id == wire.id))
                continue;

            const source = gateMap.get(wire.source);
            const target = gateMap.get(wire.target);

            if(!source || !target) {
                edges.push(wire)
                continue;
            }

            if(nodes.some((node) => node.id == source.id || node.id == target.id))
                edges.push(wire)
        }

        return Promise.resolve({ nodes: nodes, edges: edges });
    }

    function onDelete(params: OnDeleteParams) : void {
        const edges = params.edges;
        const nodes = params.nodes;

        for(const edge of edges) {
            if(edge.sourceHandle && edge.targetHandle)
                disconnectionCallback(new ConnectionData(edge.id, edge.source, edge.target, edge.sourceHandle, edge.targetHandle));
        }

        for(const node of nodes)
            deleteGateHandler(node.id);
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

<div class="w-screen h-screen z-0">
    <SvelteFlow onbeforeconnect={onConnection} ondragover={onDragOver} ondrop={onDrop} onreconnect={onReconnection} onbeforedelete={onBeforeDelete} ondelete={onDelete} connectionMode={ConnectionMode.Strict} bind:nodes={gates} bind:edges={wires} connectionLineType={ConnectionLineType.Bezier} {nodeTypes} {edgeTypes} fitView>
        <Assets bind:this={assets}></Assets>
        <MiniMap bgColor="#1e1e1e" position="top-right"/>
        <Background bgColor="#1e1e1e" variant={BackgroundVariant.Dots} />
        <Panel class="flex md:flex-row flex-col items-center max-w-1/4 gap-y-4 md:gap-x-4" position="bottom-left">
            <Control action="Program" fabIcon={faCode} disabled={true} onclick={() => { }}></Control>
            <Control action="Assistant" fabIcon={faRobot} disabled={true} onclick={() => { }}></Control>
            <Control action="Clear" fabIcon={faTrashCan} onclick={() => clearCircuitHandler()}></Control>
            <Control action="Rearrange" fabIcon={faLayerGroup} onclick={() => rearrangeLayout()}></Control>
            <Control action="Prefab" fabIcon={faCube} disabled={focused} onclick={() => generateCircuitDataHandler()}></Control>
            <Control action="Fit" fabIcon={faExpand} onclick={() => fitView(fitOptions).then()}></Control>
        </Panel>
        <Inspector title="Scene" bind:this={inspector} refocusCallback={refocusHandler} expandCallback={expandGateHandler} maximiseCallback={maximiseGateHandler} />
    </SvelteFlow>
</div>
