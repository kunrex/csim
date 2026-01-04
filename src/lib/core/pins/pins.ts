import type { Wire } from "$lib/core/wires";
import type { Gate } from "$lib/core/gates";
import { pushGate } from "$lib/core/runtime";
import { TriState } from "$lib/core/tri-state";

import { Pin } from "$lib/core/pins/pin";

export class InputPin extends Pin {
    private connection: Wire | null = null;

    public constructor(id: string, private readonly gate: Gate) {
        super(id);
    }

    public propagateLow() : Promise<void> {
        this.state = TriState.Low;
        return pushGate(this.gate);
    }

    public propagateHigh() : Promise<void> {
        this.state = TriState.High;
        return pushGate(this.gate);
    }

    public propagateUnknown() : Promise<void> {
        this.state = TriState.Unknown;
        return pushGate(this.gate);
    }

    public pushConnection(input: Wire) : Promise<void> {
        if(this.connection)
            return Promise.resolve();

        this.connection = input;
        switch (this.connection.sourceState) {
            case TriState.Low:
                return this.propagateLow();
            case TriState.High:
                return this.propagateHigh();
            default:
                return this.propagateUnknown();
        }
    }

    public popConnection(input: Wire) : Promise<void> {
        if(this.connection != input)
            return Promise.resolve();

        this.connection = null;
        return this.propagateUnknown();
    }
}

export class OutputPin extends Pin {
    private readonly connections: Wire[] = [];

    public constructor(id: string) {
        super(id);
    }

    public async propagateHigh(): Promise<void> {
        this.state = TriState.High;

        for(const connection of this.connections)
            await connection.propagate();
    }

    public async propagateLow(): Promise<void> {
        this.state = TriState.Low;

        for(const connection of this.connections)
            await connection.propagate();
    }

    public async propagateUnknown(): Promise<void> {
        this.state = TriState.Unknown;

        for(const connection of this.connections)
            await connection.propagate();
    }

    public pushConnection(input: Wire): Promise<void> {
        this.connections.push(input);
        return input.propagate();
    }

    public popConnection(input: Wire): Promise<void> {
        const index = this.connections.indexOf(input);
        if(index >= 0)
            this.connections.splice(index, 1);

        return Promise.resolve();
    }
}