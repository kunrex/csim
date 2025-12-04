import {type CircuitData, CoreGateData, edgeId,} from "$lib/circuit";
import {Gate, type GateData, type GateType, HandleWrapper, PrefabData} from "$lib/logic";

import {
    AndGatePool,
    BufferGatePool,
    BulbGatePool,
    ClockGatePool,
    NAndGatePool,
    NOrGatePool,
    NotGatePool,
    OrGatePool,
    PowerGatePool,
    PrefabManager,
    SevenSegmentPool,
    XNorGatePool,
    XorGatePool
} from "$lib/pools/gate-pool";
import type {PrefabGate} from "$lib/logic/gates/gates";
import {EdgePool} from "$lib/pools/edge-pool";

export async function deleteGate(node: CoreGateData) : Promise<void> {
    const id = node.id;

    switch (node.type) {
        case "not":
            await NotGatePool.instance.deleteGate(id);
            break;
        case "or":
            await OrGatePool.instance.deleteGate(id);
            break;
        case "nor":
            await NOrGatePool.instance.deleteGate(id);
            break;
        case "and":
            await AndGatePool.instance.deleteGate(id);
            break;
        case "nand":
            await NAndGatePool.instance.deleteGate(id);
            break;
        case "xor":
            await XorGatePool.instance.deleteGate(id);
            break;
        case "xnor":
            await XNorGatePool.instance.deleteGate(id);
            break;
        case "bulb":
            await BulbGatePool.instance.deleteGate(id);
            break;
        case "clock":
            await ClockGatePool.instance.deleteGate(id);
            break;
        case "power":
            await PowerGatePool.instance.deleteGate(id);
            break;
        case "display":
            await SevenSegmentPool.instance.deleteGate(id);
            break;
        case "buffer":
            await BufferGatePool.instance.deleteGate(id);
            break;
        default:
            await PrefabManager.instance.deletePrefabGate(id, node.type);
            break;
    }
}

export function createGateData(type: GateType, inCount: number, outCount: number) : GateData {
    let data: GateData = { };
    data["type"] = type;
    const connections: GateData = data["connections"] = { };

    for(let i = 1; i <= inCount; i++)
        connections[`in-${i}`] = data[`in-${i}`] = false;

    for(let i = 1; i <= outCount; i++)
        data[`out-${i}`] = false;

    return data;
}

export function createPrefabGateData(prefabData: PrefabData) : GateData {
    let data: GateData = { };

    data["type"] = prefabData.name;

    data["in"] = [];
    data["out"] = [];
    data["clock"] = [];
    data["display"] = [];

    const connections: GateData = data["connections"] = { };
    for(const gate of prefabData.circuitData.gates.values())
        switch (gate.type) {
            case "power": {
                    data["in"].push(gate.name);
                    data[gate.name] = connections[gate.name] = false;
                }
                break;
            case "clock": {
                    data["clock"].push(gate.name);
                    data[gate.name] = connections[gate.name] = false;
                }
                break;
            case "bulb": {
                    data["out"].push(gate.name);
                    data[gate.name] = false;
                }
                break;
            case "display":
                for(let i = 1; i <= 5; i++) {
                    const id = `${gate.name}-in-${i}`;
                    data["display"].push(id);
                    data[id] = false;
                }
                break;
        }

    return data;
}

function instantiateBufferGate(prefabGate: PrefabGate) : Gate {
    const gate = BufferGatePool.instance.createGate(false);
    gate.sync = true;
    PrefabManager.instance.registerBuffer(gate.id, prefabGate);

    return gate;
}

async function instantiateInternalGate(type: GateType) : Promise<Gate> {
    switch (type) {
        case "not":
            return NotGatePool.instance.createGate(false);
        case "and":
            return AndGatePool.instance.createGate(false);
        case "nand":
            return NAndGatePool.instance.createGate(false);
        case "or":
            return OrGatePool.instance.createGate(false);
        case "nor":
            return NOrGatePool.instance.createGate(false);
        case "xor":
            return XorGatePool.instance.createGate(false);
        case "xnor":
            return XNorGatePool.instance.createGate(false);
        default:
            return await PrefabManager.instance.instantiatePrefabGate(type, false);
    }
}

async function instantiateGates(circuitData: CircuitData, prefabGate: PrefabGate, gates: Map<string, Gate>) : Promise<void> {
    for(const pair of circuitData.gates) {
        const type = pair[1].type;

        switch (type) {
            case "bulb": {
                    const buffer = instantiateBufferGate(prefabGate);

                    gates.set(pair[0], buffer);
                    prefabGate.handleMap.set(pair[1].name, buffer.getNode("out-1")!);
                    prefabGate.bufferMap.set(buffer.id, new HandleWrapper(pair[1].name, type));
                }
                break;
            case "clock":
            case "power": {
                    const buffer = instantiateBufferGate(prefabGate);

                    gates.set(pair[0], buffer);
                    prefabGate.handleMap.set(pair[1].name, buffer.getNode("in-1")!);
                    prefabGate.bufferMap.set(buffer.id, new HandleWrapper(pair[1].name, type));
                }
                break;
            case "display": {
                    for(let i = 1; i <= 5; i++) {
                        const buffer = instantiateBufferGate(prefabGate);

                        const id = `${pair[1].name}-in-${i}`
                        gates.set(id, buffer);
                        prefabGate.handleMap.set(id, buffer.getNode("out-1")!);
                        prefabGate.bufferMap.set(buffer.id, new HandleWrapper(id, type));
                    }
                }
                break;
            default: {
                    const gate = await instantiateInternalGate(type);

                    gates.set(pair[0], gate);
                    prefabGate.gates.push(gate);
                }
                break;
        }
    }
}

async function instantiateConnections(gates: Map<string, Gate>, circuitData: CircuitData) : Promise<void> {
    for (const connection of circuitData.connections) {
        const source = gates.get(connection.source)!;

        const targetId = connection.target;
        const target = circuitData.gates.get(targetId)!.type == "display" ? gates.get(`${targetId}-${connection.targetHandle}`)! : gates.get(targetId)!;

        const id = edgeId(source.id, target.id, connection.sourceHandle, connection.targetHandle);
        await EdgePool.instance.createEdgeConnection(id, source.getNode(connection.sourceHandle)!, target.getNode(connection.targetHandle)!);
    }
}

export async function instantiatePrefabInternals(prefabData: PrefabData, prefabGate: PrefabGate) : Promise<void> {
    const circuitData = prefabData.circuitData;
    const gates = new Map<string, Gate>();

    await instantiateGates(circuitData, prefabGate, gates);
    await instantiateConnections(gates, circuitData);
}