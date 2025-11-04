import type { Connection, Node, Edge } from "@xyflow/svelte";

import { PrefabData } from "$lib/logic";
import type { NodeDetails } from "$lib/logic/prefab";
import { sevenSegmentBits, segments } from "$lib/circuit/constants";

export function createEdge(connection: Connection) : Edge {
    const id = `xy-edge__${connection.source}${connection.sourceHandle}-${connection.target}${connection.targetHandle}`;

    return {
        id:id,
        type: "bezier",
        animated: false,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
    };
}
function getGateType(id: string, gates: Node[]) : string {
    const count = gates.length;
    for(let i = 0; i < count; i++)
        if(gates[i].id == id)
            return gates[i].type as string;

    return "";
}

export function calculatePrefabData(name: string, gates: Node[], connections: Edge[]) : PrefabData {
    const prefabData = new PrefabData(name);
    const gateMap: Record<string, NodeDetails> = { };

    const connectionsCount = connections.length;
    for(let i = 0; i < connectionsCount; i++) {
        const sourceId = connections[i].source;
        const targetId = connections[i].target;

        let j = i;
        if(gateMap[sourceId] == undefined) {
            const id = (j++).toString();
            gateMap[sourceId] = { id: id, type: getGateType(sourceId, gates)};
            prefabData.gates[id] = gateMap[sourceId].type;
        }

        if(gateMap[targetId] == undefined) {
            const id = j.toString();
            gateMap[targetId] = { id: j.toString(), type: getGateType(targetId, gates) };
            prefabData.gates[id] = gateMap[targetId].type;
        }

        prefabData.connections.push({ start: gateMap[sourceId].id, end: gateMap[targetId].id });
    }

    return prefabData;
}

export function isSegmentOn(digit: number, segment: string) : boolean {
    if(digit > 9)
        return false;

    return !!((sevenSegmentBits[digit] >> segments.indexOf(segment)) & 1);
}