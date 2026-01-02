import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { fa8, faClock, faLightbulb, faMicrochip, faPowerOff, faTablet } from "@fortawesome/free-solid-svg-icons";

import { type GateType, NotGateType, AndGateType, NandGateType, OrGateType, NorGateType, XorGateType, XnorGateType, PowerGateType, ClockGateType, ProbeGateType, DisplayGateType } from "$lib/core";

import type { GateNode } from "$lib/flow/types";
import type { GateInspectorData, GateInspectorRefData } from "$lib/flow/panels/inspector/gate-inspector-data";

export function initInspectorData(gateNode: GateNode, depth: number) : GateInspectorRefData {
    return {
        ref: {
            gateId: gateNode.id,
            parentGateId: gateNode.parentId,

            name: gateNode.data.ref.name,
            expandable: gateNode.type == "prefab",

            depth: depth,
            selected: false,
            visible: depth == 0,

            fabIcon: iconMap(gateNode.data.ref.type)
        } satisfies GateInspectorData
    } satisfies GateInspectorRefData;
}

export function toggleGateVisibility(gate: GateInspectorRefData) : GateInspectorRefData {
    const ref = gate.ref;
    ref.visible = !ref.visible;

    return {
        ref: ref
    } satisfies GateInspectorRefData;
}

export function setGateSelected(gate: GateInspectorRefData, selected: boolean) : GateInspectorRefData {
    const ref = gate.ref;
    if(ref.selected == selected)
        return gate;

    ref.selected = selected;

    return {
        ref: ref
    } satisfies GateInspectorRefData;
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