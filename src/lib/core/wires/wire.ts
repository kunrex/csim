import { Pin} from "$lib/core/pins";
import { propagateState, TriState } from "$lib/core/tri-state";

export interface WireData {
    state: boolean
}

export type UpdateWireSignature = (id: string, gateData: WireData) => void;

export class Wire {
    public readonly wireData: WireData;

    public getState() : TriState | null {
        return this.source?.getState() ?? null;
    }

    public constructor(public readonly id: string, public source: Pin | null, public target: Pin | null, private readonly onUpdateFunction: UpdateWireSignature) {
        this.wireData = {
            state: false
        };
    }

    public reset() : void {
        this.wireData.state = false;
    }

    public async propagate() : Promise<void> {
        if(this.source && this.target) {
            this.wireData.state = this.source.getState() === TriState.High;
            this.onUpdateFunction(this.id, this.wireData);

            await propagateState(this.source, this.target);
        }
    }
}