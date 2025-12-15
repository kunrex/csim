import type {ElkExtendedEdge, ElkNode, LayoutOptions} from "elkjs";

import type { GateNode, WireEdge } from "$lib/flow/types";
import { sevenSegmentBits, segments } from "$lib/flow/constants";

export function capitalise(word: string) : string {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function isSegmentOn(digit: number, segment: string) : boolean {
    if(digit > 9)
        return false;

    return !!((sevenSegmentBits[digit] >> segments.indexOf(segment)) & 1);
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
