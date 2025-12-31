import { faClock, faLightbulb, faPowerOff } from "@fortawesome/free-solid-svg-icons";

import {BufferGateType, type UnaryGateData} from "$lib/core";
import type { WireModel, GateModel, AnonymousConnection } from "$lib/flow";

import { WirePool } from "$lib/pools/wire-pool";
import { MasterGatePool } from "$lib/pools/gate-pool";

import type { GateCircuitSpec } from "$lib/circuits/graph";

export async function initCircuitGate(gate: GateCircuitSpec) : Promise<GateModel | null> {
    const model = await MasterGatePool.instance.createGate(gate.type);
    if(!model)
        return null;

    model.gateData.name = gate.name;
    return model;
}

export async function initCircuitConnection(connection: AnonymousConnection, localGateMap: Map<string, GateModel>) : Promise<WireModel | null> {
    const source = localGateMap.get(connection.source);
    const target = localGateMap.get(connection.target);
    if(!source || !target)
        return null;

    const sourceGate = MasterGatePool.instance.getGate(source.id);
    const targetGate = MasterGatePool.instance.getGate(target.id);

    if(!sourceGate || !targetGate)
        return null;

    const sourcePin = sourceGate.getPin(connection.sourceHandle);
    const targetPin = targetGate.getPin(connection.targetHandle);

    if(!sourcePin || !targetPin)
        return null;

    const wire = await WirePool.instance.createWire(sourcePin, targetPin);
    return {
        id: wire.id,
        source: sourceGate.id,
        target: targetGate.id,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        wireData: wire.wireData
    } satisfies WireModel;
}

function hideInput(data: UnaryGateData) : void {
    data.hideInput = true;
    data.hideOutput = false;
}

function hideOutput(data: UnaryGateData) : void {
    data.hideInput = false;
    data.hideOutput = true;
}

export async function createPowerBuffer() : Promise<GateModel | null> {
    const buffer = await MasterGatePool.instance.createGate(BufferGateType);
    if(!buffer)
        return null;

    const data = buffer.gateData as UnaryGateData;

    data.icon = faPowerOff;
    hideInput(data);

    return buffer;
}

export async function createClockBuffer() : Promise<GateModel | null> {
    const buffer = await MasterGatePool.instance.createGate(BufferGateType);
    if(!buffer)
        return null;

    const data = buffer.gateData as UnaryGateData;

    data.icon = faClock;
    hideInput(data);

    return buffer;
}

export async function createProbeBuffer() : Promise<GateModel | null> {
    const buffer = await MasterGatePool.instance.createGate(BufferGateType);
    if(!buffer)
        return null;

    const data = buffer.gateData as UnaryGateData;

    data.icon = faLightbulb;
    hideOutput(data);

    return buffer;
}
