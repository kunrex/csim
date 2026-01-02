import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import type { RefData } from "$lib/flow/types";

export interface GateInspectorData {
    gateId: string,
    parentGateId?: string,

    depth: number,
    expandable: boolean,

    name: string,
    visible: boolean,
    selected: boolean,

    fabIcon: IconDefinition
}

export type GateInspectorRefData = RefData<GateInspectorData>;
