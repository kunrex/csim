export class ConnectionData {
    constructor(public readonly source: string, public readonly target: string, public readonly sourceHandle: string, public readonly targetHandle: string) { }
}

export enum GateType {
    And = "and",
    Or = "or",
    Nand = "nand",
    Nor = "nor",
    Xor = "xor",
    Not = "not",
    Xnor = "xnor",
    Bulb = "bulb",
    Power = "power",
    Prefab = "prefab",
}

export type EdgeData = Record<string, any>;
export type GateData = Record<string, any>;

export type onUpdateSignature = (id: string, nodeUpdate: (Partial<Node> | ((node: Node) => Partial<Node>)), options?: { replace: boolean }) => void