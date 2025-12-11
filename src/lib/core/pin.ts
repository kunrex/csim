import { Wire, type Gate } from "$lib/core";
import { LoopGuard } from "$lib/core/cycles";

export abstract class Pin {
    protected state: boolean = false;

    public enabled(): boolean {
        return this.state;
    }

    protected constructor(public readonly id: string) { }

    public abstract enable(): Promise<void>;
    public abstract disable(): Promise<void>;

    public abstract popConnection(connection: Wire) : Promise<void>;
    public abstract pushConnection(connection: Wire) : Promise<void>;

    public reset(): Promise<void> {
        this.state = false;
        return Promise.resolve();
    }
}

export class InputPin extends Pin {
    private connection: Wire | null = null;

    public isConnected() : boolean { return this.connection != null; }

    public constructor(id: string, private readonly gate: Gate) {
        super(id);
    }

    public async enable(): Promise<void> {
        this.state = true;
        await this.gate.calculateState();
    }

    public async disable(): Promise<void> {
        this.state = false;
        await this.gate.calculateState();
    }

    public async pushConnection(input: Wire): Promise<void> {
        if(this.connection)
            return;

        this.connection = input;

        if(input.enabled())
            await this.enable();
    }

    public async popConnection(input: Wire): Promise<void> {
        if(this.connection != input)
            return;

        this.connection = null;

        LoopGuard.instance.resetCycle();
        await this.disable();
    }
}

export class OutputPin extends Pin {
    private readonly connections: Wire[] = [];

    public constructor(id: string) {
        super(id);
    }

    public async enable(): Promise<void> {
        this.state = true;
        for(const connection of this.connections)
            await connection.propagate();
    }

    public async disable(): Promise<void> {
        this.state = false;
        for(const connection of this.connections)
            await connection.propagate();
    }

    public async pushConnection(input: Wire): Promise<void> {
        this.connections.push(input);
        if(this.state) {
            LoopGuard.instance.resetCycle();
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
