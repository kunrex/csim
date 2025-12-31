import type { GateType } from "$lib/core";

import type { GateModel } from "$lib/flow/types/models";

export interface GateCreationParams {
    x: number,
    y: number,
    type: GateType
}

export interface GateCreationCallbackParams extends GateCreationParams {
    gate: GateModel
}
