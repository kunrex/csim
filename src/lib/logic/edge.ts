import type { UpdateSignature } from "$lib/circuit";

import type { IEnable } from "$lib/logic/interfaces";

export class EdgeConnection {
    private state: boolean = false;

    public constructor(public id: string, public source: IEnable | null, public target: IEnable | null, private readonly onUpdateFunction: UpdateSignature) { }

    private syncEdgeData() : void {
        this.onUpdateFunction(this.id, (edge: any) => ({
            ...edge,
            animated: this.state
        }));
    }

    public async enable(): Promise<void> {
        this.state = true;
        await this.target!.enable();
        this.syncEdgeData();
    }

    public async disable(): Promise<void> {
        this.state = false;
        await this.target!.disable();
        this.syncEdgeData();
    }

    public enabled(): boolean {
        return this.state;
    }
}