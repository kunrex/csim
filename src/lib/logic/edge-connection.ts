import type { UpdateConnectionSignature } from "$lib/circuit";

import { Handle } from "$lib/logic/handle";

export class EdgeConnection {
    public enabled(): boolean {
        return this.source ? this.source.enabled() : false;
    }

    public constructor(public id: string, public source: Handle | null, public target: Handle | null, private readonly onUpdateFunction: UpdateConnectionSignature) { }

    private syncEdgeData() : void {
        this.onUpdateFunction(this.id, this.source!.enabled());
    }

    public async propagate() : Promise<void> {
        if(!this.source || !this.target)
            return;

        this.syncEdgeData();
        if(this.source.enabled())
            await this.target.enable();
        else
            await this.target.disable();
    }
}