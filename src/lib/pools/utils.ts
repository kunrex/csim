import { type CoreGateData } from "$lib/circuit";
import type { GateData, GateType } from "$lib/logic";

import { AndGatePool, BulbGatePool, NAndGatePool, NOrGatePool, NotGatePool, OrGatePool, PowerGatePool, XNorGatePool, XorGatePool, ClockGatePool, SevenSegmentPool, BufferGatePool } from "$lib/pools";

export function deleteGate(node: CoreGateData) : void {
    const id = node.id;

    switch (node.type) {
        case "not":
            NotGatePool.instance.deleteGate(id);
            break;
        case "or":
            OrGatePool.instance.deleteGate(id);
            break;
        case "nor":
            NOrGatePool.instance.deleteGate(id);
            break;
        case "and":
            AndGatePool.instance.deleteGate(id);
            break;
        case "nand":
            NAndGatePool.instance.deleteGate(id);
            break;
        case "xor":
            XorGatePool.instance.deleteGate(id);
            break;
        case "xnor":
            XNorGatePool.instance.deleteGate(id);
            break;
        case "bulb":
            BulbGatePool.instance.deleteGate(id);
            break;
        case "clock":
            ClockGatePool.instance.deleteGate(id);
            break;
        case "power":
            PowerGatePool.instance.deleteGate(id);
            break;
        case "buffer":
            BufferGatePool.instance.deleteGate(id);
            break;
        case "display":
            SevenSegmentPool.instance.deleteGate(id);
            break;
    }
}

export function createGameData(type: GateType, inCount: number, outCount: number) : GateData {
    let data: GateData = { };
    data["type"] = type;

    for(let i = 1; i <= inCount; i++) {
        data[`in-${i}`] = false;
        data[`in-${i}-connected`] = false;
    }

    for(let i = 1; i <= outCount; i++)
        data[`out-${i}`] = false;

    return data;
}