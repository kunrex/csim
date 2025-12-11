import { Pin } from "$lib/core/pin";
import type { WireData, UpdateWireSignature } from "$lib/core/types";

export class Wire {
    public readonly wireData: WireData;

    public enabled(): boolean {
        return this.source ? this.source.enabled() : false;
    }

    public constructor(public readonly id: string, public source: Pin | null, public target: Pin | null, private readonly onUpdateFunction: UpdateWireSignature) {
        this.wireData = {
            state: false
        };
    }

    public reset() : void {
        this.wireData.state = this.wireData.internal = false;
        this.wireData.reconnection = undefined;
    }

    public async propagate() : Promise<void> {
        if(this.source && this.target) {
            if(this.source.enabled()) {
                await this.target.enable();
                this.wireData.state = true;
            }
            else {
                await this.target.disable();
                this.wireData.state = false;
            }

            this.syncEdgeData();
        }
    }

    private syncEdgeData() : void {
        this.onUpdateFunction(this.id, this.wireData);
    }
}