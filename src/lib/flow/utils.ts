import type { Node, XYPosition } from "@xyflow/svelte";

import type { ElkExtendedEdge, ElkNode, LayoutOptions } from "elkjs";

import { AndGateType, BufferGateType, ClockGateType, DisplayGateType, NandGateType, NorGateType, NotGateType, OrGateType, PowerGateType, type GateData, type PrefabGateData, ProbeGateType, type WireData, XnorGateType, XorGateType } from "$lib/core";

import { sevenSegmentBits, segments } from "$lib/flow/constants";
import type { AnonymousConnection, GateNode, GateNodeType, RefGateData, RefWireData, WireEdge, WireEdgeType } from "$lib/flow/types";

export function capitalise(word: string) : string {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function isSegmentOn(digit: number, segment: string) : boolean {
    return !!((sevenSegmentBits[digit] >> segments.indexOf(segment)) & 1);
}

export function createGateNode(id: string, type: GateNodeType, data: GateData, parentId?: string, position?: XYPosition) : GateNode {
    const isChild = !!parentId;

    return {
        id: id,
        type: type,
        data: {
            ref: data
        } satisfies RefGateData,

        extent: undefined,
        parentId: parentId,
        position: isChild || !position ? { x: 0, y: 0 } : position,

        selectable: true,

        hidden: isChild,
        deletable: !isChild,
    } satisfies GateNode;
}

export function createWireEdge(id: string, type: WireEdgeType, data: WireData, connection: AnonymousConnection) : WireEdge {
    const internal = type == "internal";

     return {
        id: id,
        type: type,
         data: {
             ref: data
         } satisfies RefWireData,
        animated: data.state,

        selectable: true,

        hidden: internal,
        deletable: !internal,

        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle
    } satisfies WireEdge;
}

export function layoutGateNode(gate: GateNode, elkNode: ElkNode) : GateNode {
    const newNode = {
        ...gate,
        position: { x: elkNode.x ?? 0, y: elkNode.y ?? 0 }
    } satisfies GateNode;

    if(gate.type == "prefab") {
        const prefabData = gate.data.ref as PrefabGateData;

        if(prefabData.expanded) {
            newNode.width = elkNode.width;
            newNode.height = elkNode.height;
        }
        else if(prefabData.minimumHeight != undefined && prefabData.minimumWidth != undefined) {
            newNode.width = prefabData.minimumWidth;
            newNode.height = prefabData.minimumHeight;
        }
    }

    return newNode;
}

export function compressGateNode(gate: GateNode) : GateNode {
    if(gate.type != "prefab")
        return gate;

    const prefabData = gate.data.ref as PrefabGateData;
    if(!prefabData.expanded)
        return gate;

    prefabData.expanded = false;
    const newNode = {
        ...gate,
        data: {
            ref: prefabData
        } satisfies RefGateData,
        width: prefabData.minimumWidth,
        height: prefabData.minimumHeight
    } satisfies GateNode;

    prefabData.minimumWidth = prefabData.minimumHeight = undefined;
    return newNode;
}

export function compressAndHideGateNode(gate: GateNode) : GateNode {
    const compressed = compressGateNode(gate);
    return {
        ...compressed,
        hidden: true,
        extent: undefined,
        position: { x: 0, y: 0 }
    } satisfies GateNode;
}

export function expandGateNode(gate: GateNode) : void {
    if(gate.type != "prefab")
        return;

    const prefabData = gate.data.ref as PrefabGateData;
    if(prefabData.expanded)
        return;

    prefabData.expanded = true;
    prefabData.minimumWidth = gate.measured?.width;
    prefabData.minimumHeight = gate.measured?.height;

    gate.data = {
        ref: prefabData
    };
}

export function unHideChildGateNode(gate: GateNode) : GateNode {
    return {
        ...gate,
        hidden: false,
        extent: 'parent'
    } satisfies GateNode;
}

export function constructElkGraph(gates: GateNode[], parentOptions: LayoutOptions) : ElkNode[] {
    const nodeMap = new Map<string, ElkNode>();

    const baseNodes: ElkNode[] = [];
    for(const gate of gates) {
        if(gate.hidden)
            continue;

        const node: ElkNode = {
            id: gate.id,
            children: [],
            x: gate.position.x,
            y: gate.position.y,
            layoutOptions: undefined,
            width: gate.measured?.width ?? 30,
            height: gate.measured?.height ?? 30,
        };

        if(gate.parentId) {
            const parent = nodeMap.get(gate.parentId);
            if (!parent)
                continue;

            parent.children!.push(node);
            if (!parent.layoutOptions)
                parent.layoutOptions = {
                    ...parentOptions,
                    "elk.nodeSize.constraints": "CHILDREN",
                    "elk.padding": "[left=20, right=20, top=20, bottom=20]"
                }
        } else
            baseNodes.push(node);

        nodeMap.set(gate.id, node);
    }

    return baseNodes;
}

export function convertElkConnections(wires: WireEdge[]) : ElkExtendedEdge[] {
    const edges: ElkExtendedEdge[] = [];
    for(const wire of wires) {
        if(!wire.hidden)
            edges.push({
                id: wire.id,
                sources: [wire.source],
                targets: [wire.target]
            });
    }

    return edges;
}

export function minimapNodeColor(node: Node): string {
    const gateNode = node as GateNode;

    switch (gateNode.data.ref.type.id) {
        case NotGateType.id:
            return "#111827";
        case AndGateType.id:
            return "#dc2626";
        case NandGateType.id:
            return "#38bdf8";
        case OrGateType.id:
            return "#a855f7";
        case NorGateType.id:
            return "#84cc16";
        case XorGateType.id:
            return "#7c2d12";
        case XnorGateType.id:
            return "#4c1d95";
        case PowerGateType.id:
            return "#ef4444";
        case ClockGateType.id:
            return "#991b1b";
        case ProbeGateType.id:
            return "#fbbf24";
        case DisplayGateType.id:
            return "#1f2937";
        case BufferGateType.id:
            return "#94a3b8";
        default:
            return "#0891b2";
    }
}
