import type { Connection, Node, Edge } from "@xyflow/svelte";

import { sevenSegmentBits, segments } from "$lib/circuit/constants";
import { type CircuitGateData, CoreConnectionData } from "$lib/circuit/types";

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

export function layerGates(map: Map<string, CircuitGateData>, connections: CoreConnectionData[]) : void {
    const connectionsMap = new Map<string, string[]>();
    for (const c of connections) {
        if (!connectionsMap.has(c.source))
            connectionsMap.set(c.source, []);

        connectionsMap.get(c.source)!.push(c.target);
    }

    const queue: string[] = [];
    map.forEach((value: CircuitGateData, key: string) => {
        if(value.type == "power") {
            value.layer = 0;
            queue.push(key);
        }
        else
            value.layer = Infinity;
    });

    while (queue.length > 0) {
        const current = queue.shift()!;
        const currentLayer = map.get(current)!.layer;

        const neighbors = connectionsMap.get(current);
        if(neighbors) {
            for (const next of neighbors) {
                const nextNode = map.get(next);
                if (!nextNode)
                    continue;

                if (nextNode.layer > currentLayer + 1) {
                    nextNode.layer = currentLayer + 1;
                    queue.push(next);
                }
            }

            connectionsMap.delete(current);
        }
    }
}