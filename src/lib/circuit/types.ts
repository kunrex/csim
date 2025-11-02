import type {EdgeTypes, NodeTypes} from "@xyflow/svelte";

export type GateData = Record<string, any>;

export type GateType = "not" | "or" | "nor" | "and" | "nand" | "xor" | "xnor" | "bulb" | "power" | "clock" | "prefab";

export class ConnectionData {
    constructor(public readonly id: string, public readonly source: string, public readonly target: string, public readonly sourceHandle: string, public readonly targetHandle: string) { }
}

export type OnDeleteParams = { edges: EdgeTypes[], nodes: NodeTypes[] }

export type UpdateSignature = (id: string, nodeUpdate: (Partial<Node> | ((node: Node) => Partial<Node>)), options?: { replace: boolean }) => void

export type GateDeleteData = { id: string, type: string };