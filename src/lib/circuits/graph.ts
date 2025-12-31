import { type GateType } from "$lib/core";
import type { AnonymousConnection } from "$lib/flow";

export interface GateCircuitSpec {
    name: string,
    type: GateType,
    localId: string
}

export interface ICircuitGraph {
    gates: GateCircuitSpec[],
    wires: AnonymousConnection[]
}
