<script lang="ts">
    import { tick } from "svelte";

    import { faBroom, faCircleNodes, faCube, faExpand, faGear, faLayerGroup } from "@fortawesome/free-solid-svg-icons";

    import '@xyflow/svelte/dist/style.css'
    import { useSvelteFlow, SvelteFlow, Panel, Background, MiniMap, BackgroundVariant, type Connection, ConnectionMode, ConnectionLineType, type EdgeTypes, type FitViewOptions, type NodeTypes, type XYPosition, type SetCenterOptions } from '@xyflow/svelte';

    import type { ElkNode } from "elkjs";
    import ELK from 'elkjs/lib/elk.bundled.js';

    import type { GateCircuitSpec, ICircuitGraph } from "$lib/circuits";
    import { type AssetGateType, type GateData, type GateType, type PrefabGateData, type WireData, lockState, unlockState } from "$lib/core";

    import { notify } from "$lib/utils";
    import { playAudio } from "$lib/audio";
    import { InternalWire, Wire } from "$lib/flow/wires";
    import { dragDropProvider } from "$lib/flow/drag-drop";
    import { Assets, Control, Inspector } from "$lib/flow/panels";
    import { BinaryCoreGate, InputGate, OutputGate, PrefabGate, SevenSegment, UnaryCoreGate } from "$lib/flow/gates";
    import { actionFailureParams, deletionConfirmationParams, parentElkOptions, rootElkOptions, saveConfirmationParams } from "$lib/flow/constants";
    import { confirmationOverlay, loadingOverlay, messageOverlay, settingsOverlay, type LoadingControllerParams } from "$lib/overlays";
    import { compressAndHideGateNode, compressGateNode, constructElkGraph, convertElkConnections, createGateNode, createWireEdge, expandGateNode, layoutGateNode, unHideChildGateNode } from "$lib/flow/utils";
    import { type AnonymousConnection, type CircuitModel, type GateCreationCallbackParams, type GateCreationParams, type GateModel, type GateNode, type GateNodeType, type IdentifiedConnection, type RefGateData, type WireEdge, type WireEdgeType, type WireModel, AssetTypeStore } from "$lib/flow/types";

    interface FlowProps {
        destroyGateCallback: (gateId: string) => Promise<void>,
        createGateCallback: (createGateData: GateCreationParams) => void,

        connectionCallback: (connectionData: AnonymousConnection) => void,
        disconnectionCallback: (disconnectionData: IdentifiedConnection) => Promise<void>,

        createPrefabCallback: (circuit: ICircuitGraph) => void,
        createCircuitCallback: (circuit: ICircuitGraph) => void,

        openAssetCallback: (gateType: GateType) => void,
        deleteAssetCallback: (gateType: GateType) => void,

        renameAssetCallback: (gateType: GateType) => Promise<void>,
        saveAssetCallback: (gateType: GateType, graph: ICircuitGraph) => Promise<void>,
    }

    interface OnDeleteParams {
        nodes: GateNode[];
        edges: WireEdge[];
    }

    let { destroyGateCallback, createGateCallback, connectionCallback, disconnectionCallback, createCircuitCallback, createPrefabCallback, openAssetCallback, renameAssetCallback, deleteAssetCallback, saveAssetCallback } : FlowProps = $props();

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

    let title: string = $state.raw("");
    let openTypeStore: AssetTypeStore | null = null;

    let wires: WireEdge[] = $state.raw([]);
    let gates: GateNode[] = $state.raw([]);

    const gateIndexMap = new Map<string, number>();
    const wireIndexMap = new Map<string, number>();

    const elk = new ELK();

    const { fitView, setCenter, screenToFlowPosition, deleteElements } = useSvelteFlow();

    const fitOptions: FitViewOptions = {
        padding: 0.2,
        duration: 300,
        interpolate: "smooth"
    };

    const centerOptions: SetCenterOptions = {
        duration: 300,
        interpolate: "smooth"
    };

    function getGateIndex(id: string) : number | undefined {
        const index = gateIndexMap.get(id);
        if(index == undefined || index < 0 || index >= gates.length)
            return undefined;

        return index;
    }

    function getWireIndex(id: string) : number | undefined {
        const index = wireIndexMap.get(id);
        if(index == undefined || index < 0 || index >= wires.length)
            return undefined;

        return index;
    }

    const type = dragDropProvider();
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

        const selected = type.current;
        type.current = null;

        createGateCallback({
            x: position.x,
            y: position.y,
            type: selected
        }  satisfies GateCreationParams);
    }

    function createGateHandler(id: string, type: GateNodeType, data: GateData, parentId?: string, position?: XYPosition) {
        const node = createGateNode(id, type, data, parentId, position);

        gates = [...gates, node];
        gateIndexMap.set(node.id, gates.length - 1);

        inspector.addGate(node);
    }

    function createWireHandler(id: string, type: WireEdgeType, data: WireData, connection: AnonymousConnection) : void {
        const edge = createWireEdge(id, type, data, connection);

        wires = [...wires, edge];
        wireIndexMap.set(edge.id, wires.length - 1);
    }

    function createInternalWires(model: GateModel) : void {
        if(!model.internals)
            return;

        for(const wire of model.internals.wires)
            createWireHandler(wire.id, "internal", wire.wireData, wire);
    }

    function createInternalGates(model: GateModel) : void {
        if(!model.internals)
            return;

        for(const gate of model.internals.gates) {
            createGateHandler(gate.id, gate.nodeType, gate.gateData, model.id, undefined);

            if(gate.nodeType == "prefab")
                createInternals(gate);
        }
    }

    function createInternals(model: GateModel) : void {
        createInternalGates(model);
        createInternalWires(model);
    }

    export function instantiateGateHandler(createCallback: GateCreationCallbackParams) : void {
        const model = createCallback.gate;
        createGateHandler(model.id, model.nodeType, model.gateData, undefined, { x: createCallback.x, y: createCallback.y });

        if(model.nodeType == "prefab")
            createInternals(model);

        playAudio("gate");
    }

    export function instantiateWireHandler(createCallback: WireModel) : void {
        createWireHandler(createCallback.id, "wire", createCallback.wireData, createCallback);

        playAudio("wire");
    }

    export function instantiateCircuitHandler(gateType: GateType, model: CircuitModel) : void {
        openTypeStore = assets.openAssetHandler(gateType);
        if(!openTypeStore)
            return;

        for(const gate of model.gates) {
            createGateHandler(gate.id, gate.nodeType, gate.gateData, undefined, undefined);

            if(gate.nodeType == "prefab")
                createInternals(gate);
        }

        for(const wire of model.wires)
            createWireHandler(wire.id, "wire", wire.wireData, wire);

        rearrangeLayout();
        title = openTypeStore.gateType.name;
    }

    export function addPrefabHandler(gateType: AssetGateType) : void {
        assets.addAssetHandler(gateType, "prefabs");
    }

    export function addCircuitHandler(gateType: AssetGateType) : void {
        assets.addAssetHandler(gateType, "circuits");
    }

    export function updateGateData(id: string, gateData: GateData) : void {
        const index = getGateIndex(id);
        if(index == undefined)
            return;

        const gate = gates[index];

        const updated = [...gates];
        updated[index] = {
            ...gate,
            data: {
                ref: gateData
            } satisfies RefGateData
        };

        gates = updated;
    }

    export function updateWireData(id: string, wireData: WireData) : void {
        const index = getWireIndex(id);
        if(index == undefined)
            return;

        const wire = wires[index];
        const updated = [...wires];
        updated[index] = {
            ...wire,
            animated: wireData.state
        };

        wires = updated;
    }

    export async function waitForNodeDimensions() : Promise<boolean> {
        for (let i = 0; i < gates.length; i++) {
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

            let hidden = source == undefined || target == undefined || gates[source].hidden || gates[target].hidden;
            return wire.hidden == hidden ? wire : {
                ...wire,
                hidden: hidden,
            } satisfies WireEdge;
        });
    }

    function layoutGate(elkNode: ElkNode, updated: GateNode[]) {
        const index = getGateIndex(elkNode.id);
        if(index == undefined)
            return;

        updated[index] = layoutGateNode(gates[index], elkNode);

        if(elkNode.children)
            for(const child of elkNode.children)
                layoutGate(child, updated);
    }

    async function rearrangeLayout() : Promise<void> {
        if(gates.length == 0)
            return;

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

    async function compressGate(gateId: string) : Promise<void> {
        const index = getGateIndex(gateId);
        if(index == undefined)
            return;

        gates[index] = compressGateNode(gates[index]);

        const gatesToCompress = new Set<string>();
        gatesToCompress.add(gateId);

        gates = gates.map((node: GateNode) => {
            if(node.hidden || !node.parentId || !gatesToCompress.has(node.parentId))
                return node;

            const newNode = compressAndHideGateNode(node);
            if(newNode.type == "prefab")
                gatesToCompress.add(newNode.id);

            return newNode;
        });

        await tick();
        await waitForNodeDimensions();

        calculateWireVisibility();
    }

    async function expandGate(gateId: string) : Promise<void> {
        const index = getGateIndex(gateId);
        if(index == undefined)
            return;

        expandGateNode(gates[index]);

        gates = gates.map((node: GateNode) => {
            if(node.parentId != gateId)
                return node;

            return unHideChildGateNode(node);
        });

        await tick();
        if(await waitForNodeDimensions()) {
            calculateWireVisibility();
            await rearrangeLayout();
        }
        else {
            await Promise.allSettled([
                playAudio("error"),
                messageOverlay.open(actionFailureParams)
            ]);

            await compressGate(gateId);
        }
    }

    async function expandGateHandler(gateId: string) : Promise<void> {
        const index = getGateIndex(gateId);
        if(index == undefined)
            return Promise.resolve();

        const target = gates[index];
        if(target.type != "prefab")
            return Promise.resolve();

        const prefabData = target.data.ref as PrefabGateData;
        const params = prefabData.expanded ? {
            title: "Compression...",
            action: compressGate(gateId)
        } satisfies LoadingControllerParams: {
            title: "Expanding...",
            action: expandGate(gateId)
        };

        await Promise.allSettled([
            playAudio("overlay"),
            loadingOverlay.open(params)
        ]);
    }

    async function rearrangeHandler() : Promise<void> {
        if(gates.length == 0) {
            await notify("Circuit is empty!");
            return;
        }

        await Promise.allSettled([
            playAudio("click"),
            loadingOverlay.open({
                title: "Rearranging...",
                action: rearrangeLayout(),
            } satisfies LoadingControllerParams)
        ]);
    }

    function calculateWorldPosition(gateId: string) : XYPosition {
        const index = getGateIndex(gateId);
        if(index == undefined)
            return { x: 0, y: 0 };

        const node = gates[index];
        const position = node.position;
        if(node.parentId) {
            const parentPosition = calculateWorldPosition(node.parentId);
            return { x: parentPosition.x + position.x, y: parentPosition.y + position.y };
        }

        return position;
    }

    function maximiseGateHandler(gateId: string) : void {
        const index = getGateIndex(gateId);
        if(index == undefined)
            return;

        const node = gates[index];
        const position = calculateWorldPosition(gateId);
        setCenter(position.x + (node.measured?.width ?? 0) / 2, position.y + (node.measured?.height ?? 0) / 2, centerOptions);

        playAudio("click");
    }

    async function fitViewHandler() : Promise<void> {
        if(gates.length == 0) {
            await notify("Circuit is empty!");
            return;
        }

        await Promise.allSettled([
            playAudio("click"),
            fitView(fitOptions)
        ]);
    }

    async function clearCircuitHandler() : Promise<void> {
        if(gates.length == 0) {
            await notify("Circuit already empty!");
            return;
        }

        lockState();
        await Promise.allSettled([
            playAudio("clear"),
            deleteElements({
                nodes: gates,
                edges: wires
            })
        ]);

        return unlockState(false);
    }

    async function openSettingsHandler() : Promise<void> {
        await Promise.allSettled([
            playAudio("overlay"),
            settingsOverlay.open(null)
        ]);
    }

    function renameGateHandler(id: string, name: string) : void {
        const index = getGateIndex(id);
        if(index == undefined)
            return;

        const gate = gates[index];
        gate.data.ref.name = name;

        const updated = [...gates];
        updated[index] = {
            ...gate,
            data: {
                ref: gate.data.ref
            }
        } satisfies GateNode;

        gates = updated;
    }

    function generateCircuitGraph(): ICircuitGraph {
        const localGateMap = new Map<string, string>();

        const gateCircuitSpec = new Map<string, GateCircuitSpec>();
        const rootWires: AnonymousConnection[] = [];

        for(const gate of gates) {
            if(gate.parentId)
                continue;

            const circuitSpec = {
                name: gate.data.ref.name,
                type: gate.data.ref.type,
                localId: gateCircuitSpec.size.toString()
            } satisfies GateCircuitSpec;

            localGateMap.set(gate.id, circuitSpec.localId);
            gateCircuitSpec.set(circuitSpec.localId, circuitSpec);
        }

        for(const wire of wires) {
            if(wire.type == "internal" || !wire.sourceHandle || !wire.targetHandle)
                continue;

            const sourceId = wire.source;
            const targetId = wire.target;

            let relativeSource = localGateMap.get(sourceId), relativeTarget = localGateMap.get(targetId);
            if(!relativeSource || !relativeTarget)
                continue;

            rootWires.push({
               source: relativeSource,
               target: relativeTarget,
               sourceHandle: wire.sourceHandle,
               targetHandle: wire.targetHandle
            } satisfies AnonymousConnection);
        }

        return {
            gates: gateCircuitSpec.values().toArray(),
            wires: rootWires
        } satisfies ICircuitGraph;
    }

    function createPrefabHandler() : void {
        createPrefabCallback(generateCircuitGraph());
    }

    function createCircuitHandler() : void {
        createCircuitCallback(generateCircuitGraph());
    }

    async function openAssetHandler(gateType: GateType) : Promise<void> {
        if(!openTypeStore)
            return;

        if(openTypeStore.gateType.id == gateType.id) {
            await notify("Circuit already open!");
            return;
        }

        if(await confirmationOverlay.open(saveConfirmationParams))
            await saveAssetCallback(openTypeStore.gateType, generateCircuitGraph());

        await clearCircuitHandler();
        await tick();

        openAssetCallback(gateType);
    }

    async function renameAssetHandler() : Promise <void> {
        if(!openTypeStore)
            return;

        await renameAssetCallback(openTypeStore.gateType);

        openTypeStore.refresh();
        title = openTypeStore.gateType.name;
    }

    async function deleteAssetHandler(gateType: GateType) : Promise<void> {
        const result = await Promise.allSettled([
            playAudio("overlay"),
            confirmationOverlay.open(deletionConfirmationParams)
        ]);

        const confirmation = result[1];
        if(confirmation.status == "rejected")
            return;

        if(confirmation.value) {
            deleteAssetCallback(gateType);
            assets.deleteAssetHandler(gateType);

            await playAudio("delete");
        }
    }

    function onConnection(connection: Connection) : false {
        if(connection.sourceHandle && connection.targetHandle)
            connectionCallback({
                source: connection.source,
                target: connection.target,
                sourceHandle: connection.sourceHandle,
                targetHandle: connection.targetHandle
            } satisfies AnonymousConnection);

        return false;
    }

    async function onDisconnection(wire: WireEdge) : Promise<void> {
        if(wire.sourceHandle && wire.targetHandle) {
            wireIndexMap.delete(wire.id);

            await disconnectionCallback({
                id: wire.id,
                source: wire.source,
                target: wire.target,
                sourceHandle: wire.sourceHandle,
                targetHandle: wire.targetHandle,
            } satisfies IdentifiedConnection);
        }
    }

    async function onReconnection(oldWire: WireEdge, newWire: Connection) : Promise<void> {
        if(oldWire.sourceHandle && oldWire.targetHandle) {
            await onDisconnection(oldWire);
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

        return Promise.resolve({
            nodes: nodes,
            edges: edges } satisfies OnDeleteParams);
    }

    async function onDeleteGate(id: string) : Promise<void> {
        gateIndexMap.delete(id);
        inspector.removeGate(id);

        await destroyGateCallback(id);
    }

    async function onDelete(params: OnDeleteParams) : Promise<void> {
        const locked = lockState();

        const edges = params.edges;
        const nodes = params.nodes;

        for(const edge of edges)
            await onDisconnection(edge);

        for(const node of nodes)
            await onDeleteGate(node.id);

        const gateCount = gates.length;
        for(let i = 0; i < gateCount; i++)
            gateIndexMap.set(gates[i].id, i);

        const wireCount = wires.length;
        for(let i = 0; i < wireCount; i++)
            wireIndexMap.set(wires[i].id, i);

        await playAudio("delete");
        if(locked)
            return unlockState(true);
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

    :global(.svelte-flow__minimap-svg) {
        border-radius: .25rem;
    }
</style>

<div class="w-screen h-screen z-0" tabindex="0" role="button">
    <SvelteFlow onbeforeconnect={onConnection} ondragover={onDragOver} ondrop={onDrop} onreconnect={onReconnection} onbeforedelete={onBeforeDelete} ondelete={onDelete} connectionMode={ConnectionMode.Strict} bind:nodes={gates} bind:edges={wires} connectionLineType={ConnectionLineType.Bezier} {nodeTypes} {edgeTypes} fitView>
        <Assets bind:this={assets} openAssetCallback={openAssetHandler} deleteAssetCallback={deleteAssetHandler} />
        <MiniMap bgColor="#1e1e1e" position="top-right" />
        <Background bgColor="#1e1e1e" variant={BackgroundVariant.Dots} />
        <Panel class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 place-items-center" position="bottom-left">
            <Control action="Fit" fabIcon={faExpand} onclick={fitViewHandler} />
            <Control action="Clear" fabIcon={faBroom} onclick={clearCircuitHandler} />
            <Control action="Rearrange" fabIcon={faLayerGroup} onclick={rearrangeHandler} />
            <Control action="Prefab" fabIcon={faCube} onclick={createPrefabHandler} />
            <Control action="Circuit" fabIcon={faCircleNodes} onclick={createCircuitHandler} />
            <Control action="Settings" fabIcon={faGear} onclick={openSettingsHandler} />
        </Panel>
        <Inspector bind:this={inspector} title={title} renameAssetCallback={renameAssetHandler} expandGateCallback={expandGateHandler} maximiseGateCallback={maximiseGateHandler} renameGateCallback={renameGateHandler} />
    </SvelteFlow>
</div>
