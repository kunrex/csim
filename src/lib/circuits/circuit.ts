import { MasterGatePool } from "$lib/pools";
import type { AnonymousConnection, CircuitModel, GateModel, WireModel } from "$lib/flow";
import { type GateType, type AssetGateType, type MutableAssetGateType, type PrefabGateData, PowerGateType, ClockGateType, DisplayGateType, ProbeGateType, getGateType } from "$lib/core";

import type { GateCircuitSpec } from "$lib/circuits/graph";
import { initCircuitGate, initCircuitConnection, createPowerBuffer, createClockBuffer, createProbeBuffer } from "$lib/circuits/utils";

export class Circuit {
    public readonly type: AssetGateType;
    public readonly gates: readonly GateCircuitSpec[];
    public readonly wires: readonly AnonymousConnection[]

    constructor(protected readonly mutableType: MutableAssetGateType, protected readonly mutableGates: GateCircuitSpec[], protected readonly mutableWires: AnonymousConnection[]) {
        this.type = this.mutableType;

        this.gates = mutableGates;
        this.wires = mutableWires;
    }

    public resetDependencies(): void {
        this.mutableType.dependencies.clear();
    }

    public addDependency(gateType: GateType) {
        const count = this.mutableType.dependencies.get(gateType.id);
        if(count == undefined)
            this.mutableType.dependencies.set(gateType.id, 1);
        else
            this.mutableType.dependencies.set(gateType.id, count + 1);
    }

    public renameType(newName: string) : void {
        this.mutableType.name = newName;
    }

    public writeCircuit(gates: GateCircuitSpec[], wires: AnonymousConnection[]) {
        this.mutableGates.splice(0, this.mutableGates.length, ...gates);
        this.mutableWires.splice(0, this.mutableWires.length, ...wires);
    }

    public async instantiateCircuit() : Promise<CircuitModel> {
        const localGateMap = new Map<string, GateModel>();
        for(let i = 0; i < this.mutableGates.length; i++) {
            const child = this.mutableGates[i];

            const model = await initCircuitGate(child);
            if(!model) {
                this.removeGate(i--);
                continue;
            }

            localGateMap.set(child.localId, model);
        }

        const wires = await this.instantiateWires(localGateMap);
        return {
            wires: wires,
            gates: localGateMap.values().toArray()
        } satisfies CircuitModel;
    }

    protected removeGate(index: number) : void {
        if(index < 0 || index >= this.mutableGates.length)
            return;

        const type = this.mutableGates[index].type;
        this.mutableGates.splice(index, 1);

        for(const gate of this.mutableGates)
            if(gate.type == type)
                return;

        this.removeDependency(type.id);
    }

    protected removeDependency(dependencyId: number) : void {
        const count = this.mutableType.dependencies.get(dependencyId);
        if(count == undefined)
            return;

        if(count == 1)
            this.mutableType.dependencies.delete(dependencyId);
        else
            this.mutableType.dependencies.set(dependencyId, count - 1);

        const dependency = getGateType(dependencyId);
        if(!dependency || dependency.kind == 'base')
            return;

        const assetDependency = dependency as AssetGateType;
        for(const subDependency of assetDependency.dependencies.keys())
            this.removeDependency(subDependency);
    }

    protected async instantiateWires(localChildMap: Map<string, GateModel>) : Promise<WireModel[]> {
        let wires: WireModel[] = [];

        for(let i = 0; i < this.mutableWires.length; i++) {
            const model = await initCircuitConnection(this.mutableWires[i], localChildMap);
            if(!model) {
                this.mutableWires.splice(i--, 1);
                continue;
            }

            wires.push(model);
        }

        return wires;
    }

    public deleteCircuit() : void { }
}

export class PrefabCircuit extends Circuit {
    constructor(type: MutableAssetGateType, gates: GateCircuitSpec[], wires: AnonymousConnection[]) {
        super(type, gates, wires);
        MasterGatePool.instance.addType(this.type, this);
    }

    public async instantiatePrefab(prefabModal: GateModel) : Promise<void> {
        if(prefabModal.nodeType != "prefab")
            return;

        const gates = [];
        const prefabData = prefabModal.gateData as PrefabGateData;

        let inCount = 0, clockCount = 0, outCount = 0;
        const localGateMap = new Map<string, GateModel>();
        for(let i = 0; i < this.mutableGates.length; i++) {
            const gate = this.mutableGates[i];
            let model: GateModel | null = null;

            switch (gate.type.id) {
                case PowerGateType.id: {
                    model = await createPowerBuffer();
                    if(!model)
                        break;

                    model.gateData.name = gate.name;
                    prefabData.bufferMap.set(model.id, { type: "power", pin: `in-${++inCount}`});
                    break;
                }
                case ClockGateType.id: {
                    model = await createClockBuffer();
                    if(!model)
                        break;

                    model.gateData.name = gate.name;
                    prefabData.bufferMap.set(model.id, { type: "clock", pin: `clock-${++clockCount}`});
                    break;
                }
                case ProbeGateType.id: {
                    model = await createProbeBuffer();
                    if(!model)
                        break;

                    model.gateData.name = gate.name;
                    prefabData.bufferMap.set(model.id, { type: "probe", pin: `out-${++outCount}`});
                    break;
                }
                case DisplayGateType.id: {
                    model = await initCircuitGate(gate);
                    if(!model)
                        break;

                    prefabData.displaySet.add(model.id);
                    break;
                }
                default:
                    model = await initCircuitGate(gate);
                    break;
            }

            if(!model) {
                this.removeGate(i--);
                continue;
            }

            gates.push(model);
            localGateMap.set(gate.localId, model);
        }

        prefabModal.internals = {
            gates: gates,
            wires: await this.instantiateWires(localGateMap)
        } satisfies CircuitModel;
    }

    public deleteCircuit() : void {
        super.deleteCircuit();
        MasterGatePool.instance.deleteType(this.type);
    }
}
