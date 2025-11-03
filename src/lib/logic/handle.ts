import { EdgeConnection, Gate } from "$lib/logic";

import type { IEnable } from "$lib/logic/interfaces/i-enable";

export abstract class Handle implements IEnable {
    protected state: boolean = false;
    protected constructor(public readonly id: string) { }

    public abstract popConnection(connection: EdgeConnection) : Promise<void>;
    public abstract pushConnection(connection: EdgeConnection) : Promise<void>;

    public abstract enable(): Promise<void>;
    public abstract disable(): Promise<void>;

    public reset(): Promise<void> {
        this.state = false;
        return Promise.resolve();
    }

    public abstract enabled(): boolean ;
}

export class InHandle extends Handle {
    private connection: EdgeConnection | null = null;

    public constructor(id: string, private readonly gate: Gate) {
        super(id);
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

        await this.disable();
    }

    public enabled(): boolean {
        return this.state;
    }

    public async enable(): Promise<void> {
        this.state = true;
        await this.gate.enable();
    }

    public async disable(): Promise<void> {
        this.state = false;
        await this.gate.enable();
    }
}

export class OutHandle extends Handle {
    private readonly connections: EdgeConnection[] = [];

    public constructor(id: string) {
        super(id);
    }

    public async pushConnection(input: EdgeConnection): Promise<void> {
        this.connections.push(input);
        if(this.state)
            await input.enable();
    }

    public popConnection(input: EdgeConnection): Promise<void> {
        const index = this.connections.indexOf(input);
        if(index >= 0)
            this.connections.splice(index, 1);

        return Promise.resolve();
    }

    public enabled(): boolean {
        return this.state;
    }

    public async enable(): Promise<void> {
        this.state = true;

        for(let i = 0; i < this.connections.length; i++)
            await this.connections[i].enable();
    }

    public async disable(): Promise<void> {
        this.state = false;

        for(let i = 0; i < this.connections.length; i++)
            await this.connections[i].disable();
    }
}
