import { Pin} from "$lib/core/pins";
import { propagateObjectState, TriState } from "$lib/core/tri-state";

export interface WireData {
    state: boolean
}

export type UpdateWireSignature = (id: string, gateData: WireData) => void;

export class Wire {
    public readonly wireData: WireData;

    public get sourceState() : TriState | null {
        return this.source?.objectState ?? null;
    }

    public constructor(public readonly id: string, public source: Pin | null, public target: Pin | null, private readonly onUpdateFunction: UpdateWireSignature) {
        this.wireData = {
            state: false
        };
    }

    public reset() : void {
        this.wireData.state = false;
    }

    public propagate() : Promise<void> {
        if(this.source && this.target) {
            this.wireData.state = this.source.objectState === TriState.High;
            this.onUpdateFunction(this.id, this.wireData);

            return propagateObjectState(this.source, this.target);
        }

        return Promise.resolve();
    }
}