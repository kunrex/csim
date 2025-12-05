import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import type { GateNode } from "$lib/flow/types";

export class InspectorData {
    public constructor(public gate: GateNode, public fabIcon: IconDefinition, public depth: number, public focused: boolean) { }
}