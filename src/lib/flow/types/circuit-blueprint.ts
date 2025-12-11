import type { GateType } from "$lib/core";

import { CoreConnectionData } from "$lib/flow/types/conection-data";

export class CircuitGateData {
    public constructor(public readonly type: GateType, public readonly name: string) { }
}

export class CircuitBlueprint {
    public constructor(public readonly gates: Map<string, CircuitGateData>, public readonly connections: CoreConnectionData[]) { }
}