<script lang="ts">
    import { SvelteFlowProvider } from "@xyflow/svelte";

    import {
        DragDrop,
        Flow,
        ConnectionData,
        type CoreConnectionData,
        MasterGatePool,
        WirePool,
        type CircuitBlueprint,
        promptPrefabModal,
        PromptPrefabModal,
        masterTick,
        Pin,
        CreateGateData,
        CreateGateCallback,
        WireWrapper,
        type GateType
    } from "$lib";

    let flow: Flow;

    function getPin(gateId: string, pinId: string) : Pin | null {
        const gate = MasterGatePool.instance.getGate(gateId);
        if(!gate)
            return null;

        return gate.getPin(pinId);
    }

    function getPins(connection: CoreConnectionData) : [Pin | null, Pin | null] {
        return [getPin(connection.source, connection.sourceHandle), getPin(connection.target, connection.targetHandle)];
    }

    async function onCreateGate(createGateData: CreateGateData) : Promise<void> {
        const wrapper = await MasterGatePool.instance.createGate(createGateData.type);
        if(!wrapper)
            return;

        flow.instantiateGateCallback(new CreateGateCallback(createGateData, wrapper));
    }

    async function onDeleteGate(gateId: string) : Promise<void> {
        await MasterGatePool.instance.deleteGate(gateId);
    }

    async function onConnection(coreConnectionData: CoreConnectionData) : Promise<void> {
        const pins = getPins(coreConnectionData);
        const sourcePin = pins[0];
        const targetPin = pins[1];

        if(!sourcePin || !targetPin)
            return;

        const wire = await WirePool.instance.createWire(sourcePin, targetPin);
        flow.instantiateWireCallback(new WireWrapper(new ConnectionData(wire.id, coreConnectionData.source, coreConnectionData.target, coreConnectionData.sourceHandle, coreConnectionData.targetHandle), wire.wireData));
    }

    function onDisconnection(connectionData: ConnectionData) : void {
        const pins = getPins(connectionData);
        const sourcePin = pins[0];
        const targetPin = pins[1];

        if(!sourcePin || !targetPin)
            return;

        WirePool.instance.deleteWire(connectionData.id, sourcePin, targetPin);
    }

    async function onCreatePrefab(circuitData: CircuitBlueprint) : Promise<void> {
        const result = await promptPrefabModal.open();
        if(!result.result)
            return;

        MasterGatePool.instance.addGateType(result.value, circuitData);
        flow.addPrefabOption(result.value);
    }

    function duplicatePrefabCheck(type: GateType) : boolean {
        return MasterGatePool.instance.hasType(type);
    }

    let initialised = false;
    $effect(() => {
        if (!initialised && flow) {
            initialised = true;
            requestAnimationFrame(masterTick);

            WirePool.initInstance(flow.updateWireData);
            MasterGatePool.initInstance(flow.updateGateData);
        }
    });
</script>
<SvelteFlowProvider>
    <DragDrop>
        <Flow bind:this={flow} connectionCallback={onConnection} disconnectionCallback={onDisconnection} createGateCallback={onCreateGate} destroyGateCallback={onDeleteGate} prefabCreationCallback={onCreatePrefab}/>
    </DragDrop>
</SvelteFlowProvider>
<PromptPrefabModal duplicateCheck={duplicatePrefabCheck}></PromptPrefabModal>
