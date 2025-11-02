<script lang="ts">
    import { SvelteFlowProvider } from "@xyflow/svelte";

    import { faLightbulb, faPowerOff } from "@fortawesome/free-solid-svg-icons";

    import { Flow, InsertButton, UtilityButton, type GateData,  Handle, type GateType, ConnectionData, type GateDeleteData,
        EdgePool, AndGatePool, BulbGatePool, getGate, NAndGatePool, NOrGatePool, NotGatePool, OrGatePool, PowerGatePool, XNorGatePool, XorGatePool } from "$lib";

    function onDeleteNode(node: GateDeleteData) : void {
        const id = node.id;
        switch (node.type) {
            case 'not':
                NotGatePool.instance.deleteGate(id);
                break;
            case 'or':
                OrGatePool.instance.deleteGate(id);
                break;
            case 'nor':
                NOrGatePool.instance.deleteGate(id);
                break;
            case 'and':
                AndGatePool.instance.deleteGate(id);
                break;
            case 'nand':
                NAndGatePool.instance.deleteGate(id);
                break;
            case 'xor':
                XorGatePool.instance.deleteGate(id);
                break;
            case 'xnor':
                XNorGatePool.instance.deleteGate(id);
                break;
            case 'bulb':
                BulbGatePool.instance.deleteGate(id);
                break;
            case 'power':
                BulbGatePool.instance.deleteGate(id);
                break;
        }
    }

    function getNodes(connectionData: ConnectionData) : [Handle, Handle] | null {
        const sourceGate = getGate(connectionData.source), targetGate = getGate(connectionData.target)

        if(!sourceGate || !targetGate)
            return null;

        const sourceNode = sourceGate.getNode(connectionData.sourceHandle);
        const targetNode = targetGate.getNode(connectionData.targetHandle);

        if(!sourceNode || !targetNode)
            return null;

        return [sourceNode, targetNode]
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
    function createGate(type: GateType, data: GateData) : string {
        return flow.createGate(type, data);
    }

    $: if (flow) {
        EdgePool.initInstance(flow.updateEdgeFunction);
        NotGatePool.initInstance(createGate, flow.updateNodeFunction);
        OrGatePool.initInstance(createGate, flow.updateNodeFunction);
        NOrGatePool.initInstance(createGate, flow.updateNodeFunction);
        AndGatePool.initInstance(createGate, flow.updateNodeFunction);
        NAndGatePool.initInstance(createGate, flow.updateNodeFunction);
        XorGatePool.initInstance(createGate, flow.updateNodeFunction);
        XNorGatePool.initInstance(createGate, flow.updateNodeFunction);
        BulbGatePool.initInstance(createGate, flow.updateNodeFunction);
        PowerGatePool.initInstance(createGate, flow.updateNodeFunction);
    }
</script>

<div class="flex flex-row w-1/2 h-auto fixed bottom-0 right-1/2 translate-x-1/2 -translate-y-0 mb-8 align-center border-2 gap-x-4 border-gray-300 rounded-2xl p-3 backdrop-blur overflow-x-auto z-50">
    <InsertButton name="And" color="var(--color-and)" onClick={() => AndGatePool.instance.createGate()}></InsertButton>
    <InsertButton name="Or" color="var(--color-or)" onClick={() => OrGatePool.instance.createGate()}></InsertButton>
    <InsertButton name="Nand" color="var(--color-nand)" onClick={() => NAndGatePool.instance.createGate()}></InsertButton>
    <InsertButton name="Nor" color="var(--color-nor)" onClick={() => NOrGatePool.instance.createGate()}></InsertButton>
    <InsertButton name="Not" color="var(--color-not)" onClick={() => NotGatePool.instance.createGate()}></InsertButton>
    <InsertButton name="Xor" color="var(--color-xor)" onClick={() => XorGatePool.instance.createGate()}></InsertButton>
    <InsertButton name="Xnor" color="var(--color-xnor)" onClick={() => XNorGatePool.instance.createGate()}></InsertButton>
    <UtilityButton fabIcon={faPowerOff} color="var(--color-and)" onClick={() => PowerGatePool.instance.createGate()}></UtilityButton>
    <UtilityButton fabIcon={faLightbulb} color="orange" onClick={() => BulbGatePool.instance.createGate()}></UtilityButton>
</div>
<SvelteFlowProvider>
    <Flow bind:this={flow} on:connection={(e) => onConnection(e.detail)} on:disconnection={(e) => onDisconnection(e.detail)} on:destroy={(e) => onDeleteNode(e.detail)}/>
</SvelteFlowProvider>
