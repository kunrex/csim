import type { XYPosition } from "@xyflow/svelte";

import type { ElkExtendedEdge, ElkNode, LayoutOptions } from "elkjs";

import type {GateData, PrefabGateData, WireData} from "$lib/core";

import { sevenSegmentBits, segments } from "$lib/flow/constants";
import type { AnonymousConnection, GateNode, GateNodeType, WireEdge, WireEdgeType}  from "$lib/flow/types";

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
        data: data,

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
        data: data,
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
        const prefabData = gate.data as PrefabGateData;

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

    const prefabData = gate.data as PrefabGateData;
    if(!prefabData.expanded)
        return gate;

    prefabData.expanded = false;
    const newNode = {
        ...gate,
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

    const prefabData = gate.data as PrefabGateData;
    if(prefabData.expanded)
        return;

    prefabData.expanded = true;
    prefabData.minimumWidth = gate.measured?.width;
    prefabData.minimumHeight = gate.measured?.height;
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
