<script lang="ts">
    import {SvelteFlowProvider} from "@xyflow/svelte";

    import {Flow, Gate, InsertButton, UtilityButton, EdgeConnection, AndGate, OrGate, NorGate, NandGate, NotGate, XorGate, XnorGate} from "$lib";
    import {faLightbulb, faPowerOff} from "@fortawesome/free-solid-svg-icons";
    import {nodes} from "../../.svelte-kit/generated/client/app";
    import { ConnectionData } from "$lib/types";
    import type {IEnable} from "$lib/logic/interfaces/i-enable";

    let gates: Gate[] = [];
    let edges: EdgeConnection[] = [];
    let edgePool: EdgeConnection[] = [];

    function onCreateAnd() : void {
        const id = flow.addNode('and') as string;
        gates.push(new AndGate(id));
    }

    function onCreateOr() : void {
        const id = flow.addNode('or') as string;
        gates.push(new OrGate(id));
    }

    function onCreateNor(): void {
        const id = flow.addNode('nor') as string;
        gates.push(new NorGate(id));
    }

    function onCreateNand(): void {
        const id = flow.addNode('nand') as string;
        gates.push(new NandGate(id));
    }

    function onCreateNot(): void {
        const id = flow.addNode('not') as string;
        gates.push(new NotGate(id));
    }

    function onCreateXor(): void {
        const id = flow.addNode('xor') as string;
        gates.push(new XorGate(id));
    }

    function onCreateXnor(): void {
        const id = flow.addNode('xnor') as string;
        gates.push(new XnorGate(id));
    }

    function createPower() : void {
        const id = flow.addNode('xnor') as string;
        gates.push(new XnorGate(id));
    }

    function onDeleteNode(id: string) : void {
        const count = gates.length;

        for(let i = 0; i < count; i++) {
            if(gates[i].id == id) {
                gates.splice(i, 1);
                break;
            }
        }
    }

    function getNodes(connectionData: ConnectionData) : [IEnable, IEnable] | null {
        let sourceGate: Gate | null = null, targetGate: Gate | null = null;
        const count = nodes.length;
        for(let i = 0; i < count; i++) {
            const current = gates[i];

            if(current.id == connectionData.source)
                sourceGate = current;
            else if(current.id == connectionData.target)
                targetGate = current;

            if(sourceGate && targetGate)
                break;
        }

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

        if(edgePool.length > 0) {
            const edge = edgePool.pop();
            edge!.id=`${connectionData.source}-${connectionData.target}`
            edge!.source = nodes[0];
            edge!.target = nodes[1];
        } else {
            const connection = new EdgeConnection(`${connectionData.source}-${connectionData.target}`, nodes[0], nodes[1]);
            edges.push(connection);
        }
    }

    function onDisconnection(connectionData: ConnectionData) : void {
        const nodes = getNodes(connectionData);
        if(!nodes)
            return;

        const id =`${connectionData.source}-${connectionData.target}`;
        const count = edges.length;
        for(let i = 0; i < count; i++) {
            if(edges[i].id == id) {
                const edge = edges[i];
                edges.splice(i, 1);
                edgePool.push(edge);
                break
            }
        }
    }

    function onReconnection(oldConnection: ConnectionData, newConnection: ConnectionData) : void {
        onDisconnection(oldConnection);
        onConnection(newConnection);
    }

    let flow: any;
    const spawnFunctions = {
        "and": () => onCreateAnd(),
        "or": () => onCreateOr(),
        "nand": () => onCreateNand(),
        "nor": () => onCreateNor(),
        "not": () => onCreateNot(),
        "xor": () => onCreateXor(),
        "xnor": () => onCreateXnor(),
        "power": () => flow.addNode('power'),
        "bulb": () => flow.addNode('bulb'),
    }
</script>

<div class="flex flex-row w-1/2 h-auto fixed bottom-0 right-1/2 translate-x-1/2 -translate-y-0 mb-8 align-center border-2 gap-x-4 border-gray-300 rounded-2xl p-3 backdrop-blur overflow-x-auto z-50">
    <InsertButton name="And" color="var(--color-and)" onClick={spawnFunctions["and"]}></InsertButton>
    <InsertButton name="Or" color="var(--color-or)" onClick={spawnFunctions["or"]}></InsertButton>
    <InsertButton name="Nand" color="var(--color-nand)" onClick={spawnFunctions["nand"]}></InsertButton>
    <InsertButton name="Nor" color="var(--color-nor)" onClick={spawnFunctions["nor"]}></InsertButton>
    <InsertButton name="Not" color="var(--color-not)" onClick={spawnFunctions["not"]}></InsertButton>
    <InsertButton name="Xor" color="var(--color-xor)" onClick={spawnFunctions["xor"]}></InsertButton>
    <InsertButton name="Xnor" color="var(--color-xnor)" onClick={spawnFunctions["xnor"]}></InsertButton>
    <UtilityButton fabIcon={faPowerOff} color="var(--color-and)" onClick={spawnFunctions["power"]}></UtilityButton>
    <UtilityButton fabIcon={faLightbulb} color="orange" onClick={spawnFunctions["bulb"]}></UtilityButton>
</div>
<SvelteFlowProvider>
    <Flow bind:this={flow}/>
</SvelteFlowProvider>
