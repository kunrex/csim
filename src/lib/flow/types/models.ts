import type { GateData, WireData } from "$lib/core";

import type { GateNodeType } from "$lib/flow/types";
import type { IdentifiedConnection } from "$lib/flow/types/connections";

export interface WireModel extends IdentifiedConnection {
    wireData: WireData,
}

export interface GateModel {
    id: string,
    gateData: GateData,
    nodeType: GateNodeType,

    internals?: CircuitModel
}

export interface CircuitModel {
    gates: GateModel[],
    wires: WireModel[]
}

export class TypeModel {

}
