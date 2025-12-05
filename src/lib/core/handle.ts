import { EdgeConnection, Gate } from "";
import {LoopGuard} from "$lib/core/cycles";

export abstract class Handle {
    protected state: boolean = false;

    public enabled(): boolean {
        return this.state;
    }

    protected constructor(public readonly id: string) { }

    public abstract enable(): Promise<void>;
    public abstract disable(): Promise<void>;

    public abstract popConnection(connection: EdgeConnection) : Promise<void>;
    public abstract pushConnection(connection: EdgeConnection) : Promise<void>;

    public reset(): Promise<void> {
        this.state = false;
        return Promise.resolve();
    }
}

export class InHandle extends Handle {
    private connection: EdgeConnection | null = null;

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

    public async pushConnection(input: EdgeConnection): Promise<void> {
        if(this.connection)
            return;

        this.connection = input;
        this.gate.setInputConnected(this.id, true);

        if(input.enabled())
            await this.enable();
    }

    public async popConnection(input: EdgeConnection): Promise<void> {
        if(this.connection != input)
            return;

        this.connection = null;
        this.gate.setInputConnected(this.id, false);

        LoopGuard.instance.resetCycle();
        await this.disable();
    }
}

export class OutHandle extends Handle {
    private readonly connections: EdgeConnection[] = [];

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

    public async pushConnection(input: EdgeConnection): Promise<void> {
        this.connections.push(input);
        if(this.state) {
            LoopGuard.instance.resetCycle();
            await input.propagate();
        }
    }

    public popConnection(input: EdgeConnection): Promise<void> {
        const index = this.connections.indexOf(input);
        if(index >= 0)
            this.connections.splice(index, 1);

        return Promise.resolve();
    }
}
