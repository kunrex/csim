import { EdgeConnection } from "$lib/logic";

import type { IEnable } from "$lib/logic/interfaces/i-enable";

export abstract class Handle implements IEnable {
    public readonly connections: EdgeConnection[] = [];

    protected constructor(public readonly id: string) { }

    public abstract popConnection(connection: EdgeConnection) : Promise<void>;
    public abstract pushConnection(connection: EdgeConnection) : Promise<void>;

    public abstract enable(): Promise<void>;
    public abstract disable(): Promise<void>;

    public abstract enabled(): boolean ;
}

export class InHandle extends Handle {
    public constructor(id: string, private readonly enableObject: IEnable) {
        super(id);
    }

    public async pushConnection(input: EdgeConnection): Promise<void> {
        this.connections.push(input);

        if(input.enabled())
            await this.enable();
    }

    public async popConnection(input: EdgeConnection): Promise<void> {
        const index = this.connections.indexOf(input);
        if(index >= 0)
            this.connections.splice(index, 1);

        await this.disable();
    }

    public enabled(): boolean {
        const count = this.connections.length;
        if(count == 0)
            return false;

        for(let i = 0; i < count; i++)
            if(this.connections[i].enabled())
                return true;

        return false;
    }

    public async enable(): Promise<void> {
        await this.enableObject.enable();
    }

    public async disable(): Promise<void> {
        for(let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].enabled())
                return;
        }

        await this.enableObject.enable();
    }
}

export class OutHandle extends Handle {
    private state: boolean = false;

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
