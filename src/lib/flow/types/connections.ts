import type { Connection } from "@xyflow/svelte";

export interface AnonymousConnection extends Omit<Connection, 'sourceHandle' | 'targetHandle'> {
    sourceHandle: string,
    targetHandle: string,
}

export interface IdentifiedConnection extends AnonymousConnection {
    id: string
}
