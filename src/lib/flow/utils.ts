import type { Connection, Node, Edge } from "@xyflow/svelte";

import { sevenSegmentBits, segments } from "$lib/flow/constants";
import { type CircuitGateData, CoreConnectionData } from "$lib/flow/types";

export function capitalise(word: string) : string {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function edgeId(source: string, target: string, sourceHandle: string, targetHandle: string) {
    return `xy-edge__${source}${sourceHandle}-${target}${targetHandle}`;
}

export function createEdge(connection: Connection) : Edge {
    return {
        id: edgeId(connection.source, connection.target, connection.sourceHandle!, connection.targetHandle!),
        type: "bezier",
        animated: false,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
    };
}

export function isSegmentOn(digit: number, segment: string) : boolean {
    if(digit > 9)
        return false;

    return !!((sevenSegmentBits[digit] >> segments.indexOf(segment)) & 1);
}
