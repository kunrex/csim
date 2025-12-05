import { Handle } from "$lib/core";
import {ConnectionData, CoreGateData} from "$lib/flow";

import {
    AndGatePool, BufferGatePool, BulbGatePool, ClockGatePool,
    getGate,
    NAndGatePool,
    NOrGatePool,
    NotGatePool,
    OrGatePool, PowerGatePool, PrefabManager, SevenSegmentPool, XNorGatePool,
    XorGatePool
} from "$lib/pools/gate-pool";

export function getConnectionHandles(connectionData: ConnectionData) : [Handle, Handle] | null {
    const sourceGate = getGate(connectionData.source), targetGate = getGate(connectionData.target)

    if(!sourceGate || !targetGate)
        return null;

    const sourceNode = sourceGate.getNode(connectionData.sourceHandle);
    const targetNode = targetGate.getNode(connectionData.targetHandle);

    if(!sourceNode || !targetNode)
        return null;

    return [sourceNode, targetNode];
}

export async function deleteGate(node: CoreGateData) : Promise<void> {
    switch (node.type) {
        case "not":
            await NotGatePool.instance.deleteGate(node.id);
            break;
        case "or":
            await OrGatePool.instance.deleteGate(node.id);
            break;
        case "nor":
            await NOrGatePool.instance.deleteGate(node.id);
            break;
        case "and":
            await AndGatePool.instance.deleteGate(node.id);
            break;
        case "nand":
            await NAndGatePool.instance.deleteGate(node.id);
            break;
        case "xor":
            await XorGatePool.instance.deleteGate(node.id);
            break;
        case "xnor":
            await XNorGatePool.instance.deleteGate(node.id);
            break;
        case "bulb":
            await BulbGatePool.instance.deleteGate(node.id);
            break;
        case "clock":
            await ClockGatePool.instance.deleteGate(node.id);
            break;
        case "power":
            await PowerGatePool.instance.deleteGate(node.id);
            break;
        case "display":
            await SevenSegmentPool.instance.deleteGate(node.id);
            break;
        case "buffer":
            await BufferGatePool.instance.deleteGate(node.id);
            break;
        default:
            await PrefabManager.instance.deletePrefabGate(node.id, node.type);
            break;
    }
}