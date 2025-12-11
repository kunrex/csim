import { type CircuitBlueprint } from "$lib/flow";

import type { GateType } from "$lib/core/types/gate-data";

export class PrefabBlueprint {
    private dependencies = new Set<GateType>();

    public constructor(public readonly name: string, public readonly circuitData: CircuitBlueprint) {
        for(const gateData of this.circuitData.gates)
            this.dependencies.add(gateData[1].type);
    }

    public resolveDependency(type: GateType): boolean {
        return this.dependencies.has(type);
    }
}
