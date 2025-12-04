import type { GateType, GateData } from "$lib/logic/types/gate-data";
export type { GateType, GateData };

import { PrefabData } from "$lib/logic/types/prefab-data";
export { PrefabData };

export class HandleWrapper {
    constructor(public handleId: string, public gateType: GateType) { }
}