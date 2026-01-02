import type { Wire } from "$lib/core/wires";
import type { Gate } from "$lib/core/gates";
import { TriState } from "$lib/core/tri-state";
import { CycleGuard } from "$lib/core/runtime";

import { Pin } from "$lib/core/pins/pin";

export class InputPin extends Pin {
    private connection: Wire | null = null;

    public constructor(id: string, private readonly gate: Gate) {
        super(id);
    }

    public async propagateHigh(): Promise<void> {
        this.state = TriState.High;
        await this.gate.calculateState();
    }

    public async propagateLow(): Promise<void> {
        this.state = TriState.Low;
        await this.gate.calculateState();
    }

    public async propagateUnknown(): Promise<void> {
        this.state = TriState.Unknown;
        await this.gate.calculateState();
    }

    public async pushConnection(input: Wire): Promise<void> {
        if(this.connection)
            return;

        this.connection = input;

        switch (input.getState()) {
            case TriState.Low:
                await this.propagateLow();
                break;
            case TriState.High:
                await this.propagateHigh();
                break;
            default:
                await this.propagateUnknown();
                break;
        }
    }

    public async popConnection(input: Wire): Promise<void> {
        if(this.connection != input)
            return;

        this.connection = null;

        CycleGuard.instance.resetCycle();
        await this.propagateUnknown();
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

    public async pushConnection(input: Wire): Promise<void> {
        this.connections.push(input);

        if(this.state == TriState.High) {
            CycleGuard.instance.resetCycle();
            await input.propagate();
        }
    }

    public popConnection(input: Wire): Promise<void> {
        const index = this.connections.indexOf(input);
        if(index >= 0)
            this.connections.splice(index, 1);

        return Promise.resolve();
    }
}