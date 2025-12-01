import type { GateType } from "$lib/logic";

import { CoreConnectionData } from "$lib/circuit/types/conection-data";

export class CircuitGateData {
    public layer: number = 0;
    public constructor(public readonly type: GateType, public readonly name: string) { }
}

export class CircuitData {
    public constructor(public readonly gates: Map<string, CircuitGateData>, public readonly connections: CoreConnectionData[]) { }
}