<script lang="ts">
    import { SvelteFlowProvider } from "@xyflow/svelte";

    import {
        fa8,
        faClock,
        faCube, faExpand,
        faLightbulb, faMagnifyingGlassMinus, faMagnifyingGlassPlus,
        faMinus,
        faPlus,
        faPowerOff,
        faRobot, faTrashCan
    } from "@fortawesome/free-solid-svg-icons";

    import {
        Flow,
        Handle,
        type GateNodeType,
        ConnectionData,
        type CoreGateData,
        EdgePool,
        AndGatePool,
        BulbGatePool,
        getGate,
        NAndGatePool,
        NOrGatePool,
        NotGatePool,
        OrGatePool,
        PowerGatePool,
        XNorGatePool,
        XorGatePool,
        ClockGatePool,
        BufferGatePool,
        SevenSegmentPool,
        Gate,
        Inspector,
        UtilityButton, type CircuitData, Assets
    } from "$lib";

    import { deleteGate } from "$lib/pools/utils";
    import { masterTick} from "$lib/logic/clock";

    let inspector: any;
    function onDeleteNode(node: CoreGateData) : void {
        inspector.removeGate(node.id);
        deleteGate(node);
    }

    function getNodes(connectionData: ConnectionData) : [Handle, Handle] | null {
        const sourceGate = getGate(connectionData.source), targetGate = getGate(connectionData.target)

        if(!sourceGate || !targetGate)
            return null;

        const sourceNode = sourceGate.getNode(connectionData.sourceHandle);
        const targetNode = targetGate.getNode(connectionData.targetHandle);

        if(!sourceNode || !targetNode)
            return null;

        return [sourceNode, targetNode];
    }

    function onConnection(connectionData: ConnectionData) : void {
        const nodes = getNodes(connectionData);
        if(!nodes)
            return;

        EdgePool.instance.createEdgeConnection(connectionData.id, nodes[0], nodes[1]);
    }

    function onDisconnection(connectionData: ConnectionData) : void {
        const nodes = getNodes(connectionData);
        if(!nodes)
            return;

        EdgePool.instance.deleteEdgeConnection(connectionData.id, nodes[0], nodes[1]);
    }

    let flow: any;
    function createGate(type: GateNodeType, gate: Gate) : void {
        flow.createGate(type, gate);
        gate.gateData["name"] = `Gate ${gate.id}`;
        inspector.addGate(gate);
    }

    function createPrefab() : void {
        const data: CircuitData | null = flow.getCircuit();
        if(data) {

        }
    }

    $: if (flow) {
        EdgePool.initInstance(flow.updateConnection);
        NotGatePool.initInstance(createGate, flow.updateGate);
        OrGatePool.initInstance(createGate, flow.updateGate);
        NOrGatePool.initInstance(createGate, flow.updateGate);
        AndGatePool.initInstance(createGate, flow.updateGate);
        NAndGatePool.initInstance(createGate, flow.updateGate);
        XorGatePool.initInstance(createGate, flow.updateGate);
        XNorGatePool.initInstance(createGate, flow.updateGate);
        BulbGatePool.initInstance(createGate, flow.updateGate);
        ClockGatePool.initInstance(createGate, flow.updateGate);
        PowerGatePool.initInstance(createGate, flow.updateGate);
        BufferGatePool.initInstance(createGate, flow.updateGate);
        SevenSegmentPool.initInstance(createGate, flow.updateGate);

        requestAnimationFrame(masterTick);
    }

    function editGate(gateId: string) {
        console.log("ediding " + gateId)
    }

    function maximiseGate(gateId: string) {
        console.log("maxmimising " + gateId)
    }

    function addPrefab(prefab: string) {
        console.log("adding " + prefab)
    }
</script>
<Inspector bind:this={inspector} title="Scene" onEdit={editGate} onMaximise={maximiseGate}></Inspector>
<Assets onPrefabClick={addPrefab}></Assets>
<div class="flex md:flex-row flex-col items-center max-w-1/4 fixed bottom-0 left-0 mb-8 ml-8 gap-y-4 md:gap-x-4 z-50">
    <UtilityButton action="Prefab" fabIcon={faCube} onClick={createPrefab}></UtilityButton>
    <UtilityButton action="Assistant" fabIcon={faRobot} onClick={() => { }}></UtilityButton>
    <UtilityButton action="Fit" fabIcon={faExpand} onClick={() => { flow.flowFitView(); }}></UtilityButton>
    <UtilityButton action="Clear" fabIcon={faTrashCan} onClick={() => { flow.clearCircuit(); }}></UtilityButton>
</div>
<SvelteFlowProvider>
    <Flow bind:this={flow} on:connection={(e) => onConnection(e.detail)} on:disconnection={(e) => onDisconnection(e.detail)} on:destroy={(e) => onDeleteNode(e.detail)}/>
</SvelteFlowProvider>
