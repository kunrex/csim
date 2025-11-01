<script lang="ts">
    import {SvelteFlowProvider, useSvelteFlow} from "@xyflow/svelte";

    import {
        Flow,
        Gate,
        InsertButton,
        UtilityButton,
        EdgeConnection,
        AndGate,
        OrGate,
        NorGate,
        NandGate,
        NotGate,
        XorGate,
        XnorGate,
        type GateData, PowerGate, BulbGate
    } from "$lib";
    import {faLightbulb, faPowerOff} from "@fortawesome/free-solid-svg-icons";
    import {nodes} from "../../.svelte-kit/generated/client/app";
    import { ConnectionData } from "$lib/types";
    import type {IEnable} from "$lib/logic/interfaces/i-enable";
    import {type Writable, writable} from "svelte/store";

    let gates: Gate[] = [];
    let edges: EdgeConnection[] = [];
    let edgePool: EdgeConnection[] = [];

    function createGameData(inCount: number, outCount: number) : GateData {
        let data: GateData = { };

        for(let i = 1; i <= inCount; i++)
            data[`in-${i}`] = false;

        for(let i = 1; i <= outCount; i++)
            data[`out-${i}`] = false;

        return data;
    }

    function createAnd() : void {
        const data = createGameData(2, 1);

        const id = flow.createGate('and', data);
        gates.push(new AndGate(id, data));
    }

    function createOr() : void {
        const data = createGameData(2, 1);

        const id = flow.createGate('or', data);
        gates.push(new OrGate(id, data));
    }

    function createNor(): void {
        const data = createGameData(2, 1);

        const id = flow.createGate('nor', data);
        gates.push(new NorGate(id, data));
    }

    function createNand(): void {
        const data = createGameData(2, 1);

        const id = flow.createGate('nand', data);
        gates.push(new NandGate(id, data));
    }

    function createNot(): void {
        const data = createGameData(1, 1);

        const id = flow.createGate('not', data);
        gates.push(new NotGate(id, data));
    }

    function createXor(): void {
        const data = createGameData(2, 1);

        const id = flow.createGate('xor', data);
        gates.push(new XorGate(id, data));
    }

    function createXnor(): void {
        const data = createGameData(2, 1);

        const id = flow.createGate('xnor', data);
        gates.push(new XnorGate(id, data));
    }

    function createPower() : void {
        const data = createGameData(0, 1);

        const id = flow.createGate('power', data);
        const gate = new PowerGate(id, data, flow.updateNodeFunction);
        data["toggle"] = () => gate.enable();
        gates.push(gate);
    }

    function createBulb() : void {
        const data = createGameData(1, 0);

        const id = flow.createGate('bulb', data);
        gates.push(new BulbGate(id, data));
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
        "and": () => createAnd(),
        "or": () => createOr(),
        "nand": () => createNand(),
        "nor": () => createNor(),
        "not": () => createNot(),
        "xor": () => createXor(),
        "xnor": () => createXnor(),
        "power": () => createPower(),
        "bulb": () => createBulb()
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
