import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { fa8, faClock, faLightbulb, faMicrochip, faPowerOff, faTablet } from "@fortawesome/free-solid-svg-icons";

import { type GateType, NotGateType, AndGateType, NandGateType, OrGateType, NorGateType, XorGateType, XnorGateType, PowerGateType, ClockGateType, ProbeGateType, DisplayGateType } from "$lib/core";

import type { GateNode } from "$lib/flow/types";
import type { InspectorData } from "$lib/flow/panels/inspector/inspector-element.svelte";

export function initInspectorData(gateNode: GateNode, depth: number) : InspectorData {
    return {
        id: gateNode.id,
        parentId: gateNode.parentId,
        isPrefab: gateNode.type == "prefab",
        initialName: gateNode.data.name,

        selected: false,

        depth: depth,
        maximizable: depth == 0,
        fabIcon: iconMap(gateNode.data.type)
    } satisfies InspectorData;
}

function iconMap(key: GateType): IconDefinition {
    switch (key) {
        case NotGateType:
        case AndGateType:
        case NandGateType:
        case OrGateType:
        case NorGateType:
        case XorGateType:
        case XnorGateType:
            return faTablet;
        case DisplayGateType:
            return fa8;
        case PowerGateType:
            return faPowerOff;
        case ClockGateType:
            return faClock;
        case ProbeGateType:
            return faLightbulb;
        default:
            return faMicrochip;
    }
}