export class CoreConnectionData {
    public constructor(public readonly source: string, public readonly target: string, public readonly sourceHandle: string, public readonly targetHandle: string) { }
}

export class ConnectionData extends CoreConnectionData {
    public constructor(public readonly id: string, source: string, target: string, sourceHandle: string, targetHandle: string) {
        super(source, target, sourceHandle, targetHandle);
    }
}