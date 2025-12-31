import type { Wire } from "$lib/core/wires";
import { TriState, type TriStateObject } from "$lib/core/tri-state";

export abstract class Pin implements TriStateObject{
    protected state: TriState = TriState.Unknown;

    public getState() : TriState {
        return this.state;
    }

    protected constructor(public readonly id: string) { }

    public abstract propagateLow() : Promise<void>;
    public abstract propagateHigh() : Promise<void>;
    public abstract propagateUnknown(): Promise<void>;

    public abstract popConnection(connection: Wire) : Promise<void>;
    public abstract pushConnection(connection: Wire) : Promise<void>;

    public reset(): Promise<void> {
        this.state = TriState.Unknown;
        return Promise.resolve();
    }
}
