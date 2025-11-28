import {edgeId, type CoreGateData, type CreateGateSignature} from "$lib/circuit";
import {type Gate, type GateData, type PrefabData, SevenSegmentDisplay, XNorGate} from "$lib/logic";

import { EdgePool } from "$lib/pools/edge-pool";
import { AndGatePool, BulbGatePool, ClockGatePool, BufferGatePool, NAndGatePool, NOrGatePool, NotGatePool, OrGatePool, PowerGatePool, SevenSegmentPool, XNorGatePool, XorGatePool } from "$lib/pools/gate-pool";
import {data} from "autoprefixer";
import {deleteGate} from "$lib";
import {PrefabGate} from "$lib/logic/gates/gates";

export class PrefabPool {
    private readonly prefabMap: Record<string, CoreGateData[]> = { };

    public constructor(private readonly onCreateFunction: CreateGateSignature) { }

    public async createPrefab(data: PrefabData) : Promise<void> {
        const keys = Object.keys(data.gates);
        const gates: Record<string, Gate> = { };

        const inputs: Gate[] = [];
        const nodeData: CoreGateData[] = [];

        const count = keys.length;
        for(let i = 0 ; i < count; i++) {
            const key = keys[i];
            switch(key) {
                case "not": {
                        const gate = NotGatePool.instance.createGate(false);
                        gates[key] = gate;
                        nodeData.push({ id: gate.id, type: "not" });
                    }
                    break;
                case "or":{
                        const gate = OrGatePool.instance.createGate(false);
                        gates[key] = gate;
                        nodeData.push({ id: gate.id, type: "or" });
                    }
                    break;
                case "nor": {
                        const gate = NOrGatePool.instance.createGate(false);
                        gates[key] = gate;
                        nodeData.push({ id: gate.id, type: "nor" });
                    }
                    break;
                case "and": {
                        const gate = AndGatePool.instance.createGate(false);
                        gates[key] = gate;
                        nodeData.push({ id: gate.id, type: "and" });
                    }
                    break;
                case "nand":{
                        const gate = NAndGatePool.instance.createGate(false);
                        gates[key] = gate;
                        nodeData.push({ id: gate.id, type: "nand" });
                    }
                    break
                case "xor": {
                        const gate = XorGatePool.instance.createGate(false);
                        gates[key] = gate;
                        nodeData.push({ id: gate.id, type: "xor" });
                    }
                    break;
                case "xnor": {
                        const gate = XNorGatePool.instance.createGate(false);
                        gates[key] = gate;
                        nodeData.push({ id: gate.id, type: "xnor" });
                    }
                    break;
                case "bulb": {
                        const gate  = BufferGatePool.instance.createGate(false);
                        gates[key] = gate;
                        inputs.push(gates[key]);
                        nodeData.push({ id: gate.id, type: "buffer" });
                    }
                    break;
                case "clock": {
                        const gate  = ClockGatePool.instance.createGate(false);
                        gates[key] = gate;
                        nodeData.push({ id: gate.id, type: "clock" });
                    }
                    break;
                case "power": {
                        const gate  = BufferGatePool.instance.createGate(false);
                        gates[key] = gate;
                        nodeData.push({ id: gate.id, type: "buffer" });
                    }
                    break;
                case "display": {
                        const gate  = SevenSegmentPool.instance.createGate(false);
                        gates[key] = gate;
                        nodeData.push({ id: gate.id, type: "display" });
                    }
                    break;
                case "forward": {
                        const gate  = BufferGatePool.instance.createGate(false);
                        gates[key] = gate;
                        nodeData.push({ id: gate.id, type: "buffer" });
                    }
                    break;
            }
        }

        const connectionCount = data.connections.length;
        for(let i = 0; i < connectionCount; i++) {
            const connection = data.connections[i];
            const source = gates[connection.source];
            const target = gates[connection.target];
            const id = edgeId(connection.source, connection.target, source.id, target.id);

            await EdgePool.instance.createEdgeConnection(id, source.getNode(connection.sourceHandle)!, source.getNode(connection.targetHandle)!);
        }

        const gateData: GateData = { };
        gateData["type"] = "prefab";

        for(let i = 0; i < inputs.length; ++i)
            gateData[`in-${i}`] = inputs[i].gateData;

        //const gate = new PrefabGate('-1', gateData, updateGate);
        //this.onCreateFunction("prefab", gate);
        //this.prefabMap[gate.id] = nodeData;
    }

    public deleteGate(id: string) : void {
        const gates = this.prefabMap[id];
        if(data) {
            const count = gates.length;
            for(let i = 0 ; i < count; i++)
                deleteGate({ id: gates[i].id, type: gates[i].type });
        }
    }
}
