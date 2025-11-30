<script lang="ts">
    import { SvelteFlowProvider } from "@xyflow/svelte";

    import { fa8, faClock, faLightbulb, faPowerOff } from "@fortawesome/free-solid-svg-icons";

    import {
        Flow,
        InsertButton,
        IconInsertButton,
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
        Gate
    } from "$lib";

    import { deleteGate } from "$lib/pools/utils";
    import { masterTick} from "$lib/logic/clock";
    import {FontAwesomeIcon} from "@fortawesome/svelte-fontawesome";

    function onDeleteNode(node: CoreGateData) : void {
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
        return flow.createGate(type, gate);
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
</script>

<div class="flex flex-row items-center w-1/2 h-auto fixed bottom-0 right-1/2 translate-x-1/2 -translate-y-0 mb-8 overflow-x-auto gap-x-4 ui-element">
    <InsertButton name="And" color="color-and" onClick={() => AndGatePool.instance.createGate(true)}></InsertButton>
    <InsertButton name="Or" color="color-or" onClick={() => OrGatePool.instance.createGate(true)}></InsertButton>
    <InsertButton name="Nand" color="color-nand" onClick={() => NAndGatePool.instance.createGate(true)}></InsertButton>
    <InsertButton name="Nor" color="color-nor" onClick={() => NOrGatePool.instance.createGate(true)}></InsertButton>
    <InsertButton name="Not" color="color-not" onClick={() => NotGatePool.instance.createGate(true)}></InsertButton>
    <InsertButton name="Xor" color="color-xor" onClick={() => XorGatePool.instance.createGate(true)}></InsertButton>
    <InsertButton name="Xnor" color="color-xnor" onClick={() => XNorGatePool.instance.createGate(true)}></InsertButton>
    <IconInsertButton fabIcon={faClock} color="color-clock" onClick={() => ClockGatePool.instance.createGate(true)}></IconInsertButton>
    <IconInsertButton fabIcon={faPowerOff} color="color-power" onClick={() => PowerGatePool.instance.createGate(true)}></IconInsertButton>
    <IconInsertButton fabIcon={faLightbulb} color="color-bulb" onClick={() => BulbGatePool.instance.createGate(true)}></IconInsertButton>
    <IconInsertButton fabIcon={fa8} color="color-display" onClick={() => SevenSegmentPool.instance.createGate(true)}></IconInsertButton>
</div>
<SvelteFlowProvider>
    <Flow bind:this={flow} on:connection={(e) => onConnection(e.detail)} on:disconnection={(e) => onDisconnection(e.detail)} on:destroy={(e) => onDeleteNode(e.detail)}/>
</SvelteFlowProvider>
