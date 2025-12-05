import type { GateType, GateData } from "$lib/core/types/gate-data";
export type { GateType, GateData };

import { PrefabData } from "$lib/core/types/prefab-data";
export { PrefabData };

export class HandleWrapper {
    constructor(public handleId: string, public gateType: GateType) { }
}