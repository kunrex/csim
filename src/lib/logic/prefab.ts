export type NodeDetails = { id: string, type: string };
export type ConnectionDetails = { source: string, target: string, sourceHandle: string, targetHandle: string };

export class PrefabData {
    public readonly gates: Record<string, string> = { };
    public readonly connections: ConnectionDetails[] = [];

    constructor(public readonly name: string) { }
}
