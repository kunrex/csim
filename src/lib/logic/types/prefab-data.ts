import type { GateType } from "$lib/logic";
import type { CircuitData } from "$lib/circuit";

export class PrefabData {
    private dependencies = new Set<GateType>();

    public constructor(public readonly name: string, public readonly circuitData: CircuitData) {
        for(const gateData of this.circuitData.gates)
            this.dependencies.add(gateData[1].type);
    }

    public resolveDependency(type: GateType): boolean {
        return this.dependencies.has(type);
    }
}