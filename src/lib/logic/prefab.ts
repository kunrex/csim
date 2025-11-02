export type NodeDetails = { id: string, type: string };
export type ConnectionDetails = { start: string, end: string };

export class PrefabData {
    public readonly gates: Record<string, string> = { };
    public readonly connections: ConnectionDetails[] = [];

    constructor(public readonly name: string) { }
}
