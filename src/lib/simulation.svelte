<script lang="ts">
    import { SvelteFlowProvider } from "@xyflow/svelte";

    import { notify, prompt } from "$lib/utils";
    import { preLoadAudioFiles } from "$lib/audio";
    import { MasterGatePool, WirePool } from "$lib/pools";
    import { type ICircuitGraph, Circuit, PrefabCircuit } from "$lib/circuits";
    import { masterTick, createAssetType, getGateType, type GateType, type AssetGateType, type MutableAssetGateType, type Pin } from "$lib/core";
    import { type AnonymousConnection, type GateCreationParams, type GateCreationCallbackParams, type WireModel, type IdentifiedConnection, Flow, DragDrop } from "$lib/flow";
    import { loadingOverlay, type TitleMessageParams, type PromptMessageParams, MessageOverlay, LoadingOverlay, PromptOverlay, ConfirmationOverlay, SettingsOverlay, NotificationOverlay } from "$lib/overlays";

    const renameAssetParams = {
        title: "Rename Asset",
        message: "Asset names must be unique and have a maximum length of 32 characters."
    } satisfies TitleMessageParams;

    const namePrefabParams = {
        title: "Name your asset!",
        message: "Asset names must be unique and have a maximum length of 32 characters."
    } satisfies TitleMessageParams;

    let flow: Flow;

    let circuits = new Map<number, Circuit>();

    function addDependency(circuit: Circuit, gateType: GateType): void {
        circuit.addDependency(gateType);

        if(gateType.kind == 'base')
            return;

        const assetGateType = gateType as AssetGateType;
        for(const dependencyId of assetGateType.dependencies.keys()) {
            const dependency = getGateType(dependencyId);
            if(!dependency)
                return;

            circuit.addDependency(dependency);
        }
    }

    function resolveDependencies(circuit: Circuit) : void {
        circuit.resetDependencies();

        for(const gate of circuit.gates)
            if(circuits.has(gate.type.id))
                addDependency(circuit, gate.type);
    }

    async function renameAsset(gateType: GateType) : Promise<void> {
        const circuit = circuits.get(gateType.id);
        if(!circuit)
            return;

        const result = await prompt({
            ...renameAssetParams,
            placeholder: circuit.type.name
        } satisfies PromptMessageParams);
        if(!result)
            return;

        circuit.renameType(result);
    }

    function saveAsset(gateType: GateType, circuitGraph: ICircuitGraph) : Promise<void> {
        const circuit = circuits.get(gateType.id);
        if(!circuit)
            return Promise.resolve();

        circuit.writeCircuit(circuitGraph.gates, circuitGraph.wires);
        resolveDependencies(circuit);
        return Promise.resolve();
    }

    function duplicateCircuitCheck(value: string) : boolean {
        return circuits.values().some(circuit => circuit.type.name == value);
    }

    function createAsset(gateType: MutableAssetGateType, circuitGraph: ICircuitGraph) : void {
        const circuit = new PrefabCircuit(gateType, circuitGraph.gates, circuitGraph.wires);
        circuits.set(gateType.id, circuit);
        resolveDependencies(circuit);
    }

    async function createPrefab(circuitGraph: ICircuitGraph) : Promise<void> {
        const result = await prompt(namePrefabParams);
        if(!result || duplicateCircuitCheck(result))
            return;

        const gateType = createAssetType(result);

        createAsset(gateType, circuitGraph);
        flow.addPrefabHandler(gateType);

        await notify("Prefab created successfully!");
    }

    async function createCircuit(circuitGraph: ICircuitGraph) : Promise<void> {
        const result = await prompt(namePrefabParams);
        if(!result || duplicateCircuitCheck(result))
            return;

        const gateType = createAssetType(result);

        createAsset(gateType, circuitGraph);
        flow.addCircuitHandler(gateType);

        await notify("Circuit created successfully!");
    }

    async function openAsset(gateType: GateType) : Promise<void> {
        const circuit = circuits.get(gateType.id);
        if(!circuit)
            return;

        flow.instantiateCircuitHandler(gateType, await circuit.instantiateCircuit());
    }

    function deleteAsset(gateType: GateType) : void {
        const circuit = circuits.get(gateType.id);
        if(!circuit)
            return;

        circuit.deleteCircuit();
        circuits.delete(gateType.id);
    }

    function getPin(gateId: string, pinId: string) : Pin | null {
        const gate = MasterGatePool.instance.getGate(gateId);
        if(!gate)
            return null;

        return gate.getPin(pinId);
    }

    function getPins(connection: AnonymousConnection) : [Pin | null, Pin | null] {
        return [getPin(connection.source, connection.sourceHandle), getPin(connection.target, connection.targetHandle)];
    }

    async function onCreateGate(createGateData: GateCreationParams) : Promise<void> {
        const wrapper = await MasterGatePool.instance.createGate(createGateData.type);
        if(!wrapper)
            return;

        flow.instantiateGateHandler({
            gate: wrapper ,
            ...createGateData } satisfies GateCreationCallbackParams);
    }

    async function onDeleteGate(gateId: string) : Promise<void> {
        await MasterGatePool.instance.deleteGate(gateId);
    }

    async function onConnection(coreConnectionData: AnonymousConnection) : Promise<void> {
        const pins = getPins(coreConnectionData);
        const sourcePin = pins[0];
        const targetPin = pins[1];

        if(!sourcePin || !targetPin)
            return;

        const wire = await WirePool.instance.createWire(sourcePin, targetPin);
        flow.instantiateWireHandler({
            id: wire.id,
            wireData: wire.wireData,
            ...coreConnectionData
        } satisfies WireModel);
    }

    async function onDisconnection(connectionData: IdentifiedConnection) : Promise<void> {
        const pins = getPins(connectionData);
        const sourcePin = pins[0];
        const targetPin = pins[1];

        if(!sourcePin || !targetPin)
            return;

        await WirePool.instance.deleteWire(connectionData.id, sourcePin, targetPin);
    }

    async function onInitialise() : Promise<void> {
        preLoadAudioFiles()
        requestAnimationFrame(masterTick);

        WirePool.initInstance(flow.updateWireData);
        MasterGatePool.initInstance(flow.updateGateData);

        const defaultGateType = createAssetType("Default");

        createAsset(defaultGateType, {
            gates: [],
            wires: []
        } satisfies ICircuitGraph);

        const defaultCircuit = circuits.get(defaultGateType.id);
        if(!defaultCircuit)
            return;

        flow.addCircuitHandler(defaultGateType);
        flow.instantiateCircuitHandler(defaultGateType, await defaultCircuit.instantiateCircuit());
    }

    let initialised = false;

    let resolveInitialised: (() => void) | null = null;
    const initialisedPromise = new Promise<void>((resolve) => {
        resolveInitialised = resolve;
    });

    loadingOverlay.open({
        title: "Initialising...",
        action: initialisedPromise
    });

    $effect(() => {
        if (!initialised && flow && resolveInitialised != null) {
            initialised = true;
            onInitialise().then(() => resolveInitialised == null ? Promise.resolve() : resolveInitialised());
        }
    });
</script>
<SvelteFlowProvider>
    <DragDrop>
        <Flow bind:this={flow} createPrefabCallback={createPrefab} createCircuitCallback={createCircuit} openAssetCallback={openAsset} deleteAssetCallback={deleteAsset} renameAssetCallback={renameAsset} saveAssetCallback={saveAsset} connectionCallback={onConnection} disconnectionCallback={onDisconnection} createGateCallback={onCreateGate} destroyGateCallback={onDeleteGate} />
    </DragDrop>
</SvelteFlowProvider>
<PromptOverlay duplicateCheck={duplicateCircuitCheck} />
<SettingsOverlay />
<ConfirmationOverlay />
<NotificationOverlay />
<MessageOverlay />
<LoadingOverlay />
