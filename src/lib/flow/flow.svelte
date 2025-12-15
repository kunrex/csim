<script lang="ts">
    import '@xyflow/svelte/dist/style.css'
    import {
        addEdge,
        Background,
        BackgroundVariant,
        type Connection,
        ConnectionLineType,
        ConnectionMode,
        type EdgeTypes,
        type FitViewOptions,
        MiniMap,
        type NodeTypes,
        Panel,
        SvelteFlow,
        useSvelteFlow,
        type XYPosition
    } from '@xyflow/svelte';

    import {
        faCode,
        faCube,
        faExpand,
        faGear,
        faLayerGroup,
        faRobot,
        faTrashCan
    } from "@fortawesome/free-solid-svg-icons";

    import type {ElkNode, LayoutOptions} from "elkjs";
    import ELK from 'elkjs/lib/elk.bundled.js';

    import {type GateData, type GateType, type PrefabGateData, type WireData} from "$lib/core";

    import {InternalWire, Wire} from "$lib/flow/wires";
    import {useDragDrop} from "$lib/flow/drag-drop";
    import {Assets, Control, Inspector} from "$lib/flow/panels";
    import {constructElkGraph, convertElkConnections} from "$lib/flow/utils";
    import {BinaryCoreGate, InputGate, OutputGate, PrefabGate, SevenSegment, UnaryCoreGate} from "$lib/flow/gates";
    import {
        CircuitBlueprint,
        CircuitGateData,
        ConnectionData,
        CoreConnectionData,
        CreateGateCallback,
        CreateGateData,
        type GateNode,
        type GateNodeType,
        GateWrapper,
        type WireEdge,
        type WireEdgeType,
        WireWrapper
    } from "$lib/flow/types";
    import {onMount, tick} from "svelte";
    import {prefabHandleGap} from "$lib/flow/constants";
    import {RectangleSelection} from "$lib/flow/selection/index.js";
    import {loadingOverlay, loopGuardOverlay, messageOverlay, MessageOverlay} from "$lib/overlays";

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

    const gateIndexMap = new Map<string, number>();

    const elk = new ELK();

    const parentElkOptions: LayoutOptions = {
        'elk.spacing.nodeNode': '50',
        'elk.layered.spacing.nodeNodeBetweenLayers': '70',
    };

    const rootElkOptions: LayoutOptions = {
        'elk.algorithm': 'layered',
        'elk.spacing.nodeNode': '60',
        'elk.layered.spacing.nodeNodeBetweenLayers': '80',
    };

    const { fitView, setCenter, screenToFlowPosition, deleteElements } = useSvelteFlow();

    const fitOptions: FitViewOptions = {
        padding: 0.2,
        duration: 300,
        interpolate: "smooth"
    };

    function getGateIndex(id: string) : number | undefined {
        const index = gateIndexMap.get(id);
        if(index == undefined || index < 0 || index >= gateIndexMap.size)
            return undefined;

        return index;
    }

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

    function createGateHandler(id: string, type: GateNodeType, data: GateData, parentId?: string, position?: XYPosition) {
        const isChild = !!parentId;

        const node: GateNode = {
            id: id,
            type: type,
            data: data,

            extent: undefined,
            parentId: parentId,
            position: isChild || !position ? { x: 0, y: 0 } : position,

            selectable: true,

            hidden: isChild,
            deletable: !isChild,
        };

        gates = [...gates, node];
        gateIndexMap.set(node.id, gates.length - 1);

        inspector.addGate(node);
    }

    function createEdgeHandler(id: string, type: WireEdgeType, data: WireData, connection: CoreConnectionData) : void {
        const internal = type == "internal";

        const wire: WireEdge = {
            id: id,
            type: type,
            data: data,
            animated: data.state,

            selectable: true,

            hidden: internal,
            deletable: !internal,

            source: connection.source,
            target: connection.target,
            sourceHandle: connection.sourceHandle,
            targetHandle: connection.targetHandle
        };

        wires = addEdge(wire, wires);
    }

    function initInternalConnections(wrapper: GateWrapper) {
        if(!wrapper.connections)
            return;

        for(const connection of wrapper.connections)
            createEdgeHandler(connection.connectionData.id, "internal", connection.wireData, connection.connectionData);
    }

    function initChildGates(wrapper: GateWrapper) {
        if(!wrapper.children)
            return;

        for(const child of wrapper.children) {
            createGateHandler(child.id, child.nodeType, child.gateData, wrapper.id, undefined);

            if(child.nodeType == "prefab")
                initPrefab(child);
        }
    }

    function initPrefab(wrapper: GateWrapper) {
        initChildGates(wrapper);
        initInternalConnections(wrapper);
    }

    export function instantiateGateCallback(createCallback: CreateGateCallback) : void {
        const wrapper = createCallback.gate;
        createGateHandler(wrapper.id, wrapper.nodeType, wrapper.gateData, undefined, { x: createCallback.creation.x, y: createCallback.creation.y });

        if(wrapper.nodeType == "prefab")
            initPrefab(wrapper);
    }

    export function instantiateWireCallback(createCallback: WireWrapper) : void {
        createEdgeHandler(createCallback.connectionData.id, "wire", createCallback.wireData, createCallback.connectionData);
    }

    export function updateGateData(id: string, gateData: GateData) : void {
        const index = getGateIndex(id);
        if(index == undefined)
            return;

        const gate = gates[index];

        const updated = [...gates];
        updated[index] = {
            ...gate,
            data: gateData
        };

        gates = updated;
    }

    export function updateWireData(id: string, wireData: WireData) : void {
        wires = wires.map((wire: WireEdge) => wire.id == id ? {
                ...wire,
                data: wireData,
                animated: wireData.state
            } : wire
        );
    }

    export function addPrefabType(type: GateType) : void {
        assets.addPrefabType(type);
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

    function calculateWireVisibility() : void {
        wires = wires.map((wire: WireEdge) => {
            const source = gateIndexMap.get(wire.source);
            const target = gateIndexMap.get(wire.target);

            if(!source || !target)
                return wire;

            let hidden = !source || !target || gates[source].hidden || gates[target].hidden;
            return wire.hidden == hidden ? wire : {
                ...wire,
                hidden: hidden,
            };
        });
    }

    function layoutGate(elkNode: ElkNode, updated: GateNode[]) {
        const index = getGateIndex(elkNode.id);
        if(index == undefined)
            return;

        const gate = gates[index];
        const newNode = { ... gate } satisfies GateNode;

        newNode.position = { x: elkNode.x!, y: elkNode.y! };
        if(gate.type == "prefab") {
            const data = gate.data as PrefabGateData;

            if(data.expanded) {
                newNode.width = elkNode.width;
                newNode.height = elkNode.height;
            }
            else if(data.minimumHeight != undefined && data.minimumWidth != undefined) {
                newNode.width = data.minimumWidth;
                newNode.height = data.minimumHeight;
            }
        }

        updated[index] = newNode;

        if(elkNode.children)
            for(const child of elkNode.children)
                layoutGate(child, updated);
    }

    async function rearrangeLayout() : Promise<void> {
        const graph = {
            id: 'root',
            layoutOptions: rootElkOptions,
            edges: convertElkConnections(wires),
            children: constructElkGraph(gates, parentElkOptions)
        };

        const layout = await elk.layout(graph);
        if(!layout.children)
            return;

        const updated = [...gates];
        for(const gate of layout.children)
            layoutGate(gate, updated);

        gates = updated;
        await fitView();
    }

    async function expandGate(gateId: string) : Promise<void> {
        loadingOverlay.open("Expanding...")

        const index = getGateIndex(gateId);
        if(index == undefined)
            return;

        const target = gates[index];
        if(target.type != "prefab")
            return;

        const data = target.data as PrefabGateData;
        if(data.expanded)
            return;

        data.expanded = true;
        data.minimumWidth = target.measured?.width ?? (prefabHandleGap * (Math.max(data.clockCount, data.displayCount) + 2));
        data.minimumHeight = target.measured?.height ?? (prefabHandleGap * (Math.max(data.powerCount, data.probeCount) + 2));

        gates = gates.map((node: GateNode) => {
            if(node.parentId != gateId)
                return node;

            return {
                ...node,
                hidden: false,
                extent: 'parent',
            } satisfies GateNode;
        });

        await tick();
        if(await waitForNodeDimensions()) {
            calculateWireVisibility();
            await rearrangeLayout();
        }
        else
            await resetGates();

        await new Promise(resolve => setTimeout(resolve, 500));
        loadingOverlay.close();
    }

    async function resetGates() : Promise<void> {
        loadingOverlay.open("Rearranging...")

        gates = gates.map((node: GateNode) => {
            if(node.hidden)
                return node;

            const newNode = { ...node } satisfies GateNode;
            if(node.type == "prefab") {
                const data = newNode.data as PrefabGateData;

                if(data.expanded) {
                    data.expanded = false;
                    newNode.width = data.minimumWidth;
                    newNode.height = data.minimumHeight;

                    data.minimumWidth = data.minimumHeight = undefined;
                }
            }

            if(newNode.parentId) {
                newNode.hidden = true;
                newNode.extent = undefined;
                newNode.position = { x: 0, y: 0 };
            }

            return newNode;
        });

        await tick();
        await waitForNodeDimensions();

        calculateWireVisibility();

        await new Promise(resolve => setTimeout(resolve, 500));
        loadingOverlay.close();
    }

    function calculateGatePosition(gateId: string) : XYPosition {
        const index = getGateIndex(gateId);
        if(index == undefined)
            return { x: 0, y: 0};

        const node = gates[index];
        const position = node.position;
        if(node.parentId) {
            const parentPosition = calculateGatePosition(node.parentId);
            return { x: parentPosition.x + position.x, y: parentPosition.y + position.y };
        }

        return position;
    }

    async function rearrangeHandler() : Promise<void> {
        loadingOverlay.open("Rearranging...");
        await rearrangeLayout();

        await new Promise(resolve => setTimeout(resolve, 500));
        loadingOverlay.close();
    }

    function maximiseGateHandler(gateId: string) : void {
        const index = getGateIndex(gateId);
        if(index == undefined)
            return;

        const node = gates[index];
        const position = calculateGatePosition(gateId);
        setCenter(position.x + (node.measured?.width ?? 0) / 2, position.y + (node.measured?.height ?? 0) / 2);
    }

    function clearCircuitHandler() : void {
        deleteElements({
            nodes: gates,
            edges: wires
        });
    }

    function renameGateHandler(id: string, name: string) : void {
        const index = getGateIndex(id);
        if(index == undefined)
            return;

        const gate = gates[index];
        gate.data.name = name;

        const updated = [...gates];

        updated[index] = {
            ...gate,
            data: gate.data
        } satisfies GateNode;

        gates = updated;
    }

    function selectGateHandler(selected: Set<string>) : void {
        const count = gates.length;
        for(let i = 0; i < count; i++) {
            const node = gates[i];
            if(!selected.has(node.id))
                continue;

            gates[i] = {
                ...node,
                selected: true,
            } satisfies GateNode;
        }
    }

    function generateCircuitDataHandler() : void {
        if(!gates.some((node: GateNode) => node.type == "s-output")) {
            messageOverlay.open({ title: "Couldn't Generate Prefab", message: "Prefabs must have at least one input node. This can be a clock signal or a power signal." })
            return;
        }

        if(!gates.some((node: GateNode) => node.type == "s-input" || node.type == "display"))
        {
            messageOverlay.open({ title: "Couldn't Generate Prefab", message: "Prefabs must have at least one output node. This can be a probe gate or a 7 segment display." })
            return;
        }

        const localGateMap = new Map<string, string>();

        const gateData = new Map<string, CircuitGateData>();
        const connectionData: CoreConnectionData[] = [];

        const edgeCount = wires.length;
        for(let i = 0; i < edgeCount; i++) {
            const connection = wires[i];
            if(connection.type == "internal")
                continue;

            if(!connection.sourceHandle || !connection.targetHandle)
                continue;

            const sourceId = connection.source;
            const targetId = connection.target;

            let relativeSource = localGateMap.get(sourceId), relativeTarget = localGateMap.get(targetId);
            if(relativeSource == undefined) {
                relativeSource = gateData.size.toString();
                localGateMap.set(sourceId, relativeSource);

                const index = getGateIndex(sourceId);
                if(index == undefined)
                    continue;

                const gate = gates[index];
                gateData.set(relativeSource, new CircuitGateData(gate.data.type, gate.data.name));
            }

            if(relativeTarget == undefined) {
                relativeTarget = gateData.size.toString();
                localGateMap.set(targetId, relativeTarget);

                const index = getGateIndex(targetId);
                if(index == undefined)
                    continue;

                const gate = gates[index];
                gateData.set(relativeTarget, new CircuitGateData(gate.data.type, gate.data.name));
            }

            connectionData.push(new CoreConnectionData(relativeSource, relativeTarget, connection.sourceHandle, connection.targetHandle));
        }

        if(connectionData.length == 0) {
            messageOverlay.open({ title: "Couldn't Generate Prefab", message: "There seem to be no root level connections in your circuit!" })
            return;
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

            if(nodes.some((node) => node.id == wire.source || node.id == wire.target))
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

        for(const node of nodes) {
            const id = node.id;

            gateIndexMap.delete(id);
            inspector.removeGate(id);

            destroyGateCallback(id);
        }

        const count = gates.length;
        for(let i = 0; i < count; i++)
            gateIndexMap.set(gates[i].id, i);
    }

    onMount(() => {

    })
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
            <Control action="Clear" fabIcon={faTrashCan} onclick={() => clearCircuitHandler()}></Control>
            <Control action="Fit" fabIcon={faExpand} onclick={() => fitView(fitOptions).then()}></Control>
            <Control action="Rearrange" fabIcon={faLayerGroup} onclick={() => rearrangeHandler()}></Control>
            <Control action="Prefab" fabIcon={faCube} disabled={focused} onclick={() => generateCircuitDataHandler()}></Control>
            <Control action="Settings" fabIcon={faGear} onclick={() => loopGuardOverlay.open(true)}></Control>
        </Panel>
        <Inspector title="Scene" bind:this={inspector} refocusCallback={resetGates} expandCallback={expandGate} maximiseCallback={maximiseGateHandler} renameGateCallback={renameGateHandler} />
        <RectangleSelection onNodesSelect={selectGateHandler}></RectangleSelection>
    </SvelteFlow>
</div>
