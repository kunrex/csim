import type { GateNodeType } from "$lib/flow";

import { Pin } from "$lib/core/pins";

import type { GateData } from "$lib/core/gates/data";
import type { GateType } from "$lib/core/gates/types";

export type Gate = BaseGate<GateData>;
export type UpdateGateSignature = (id: string, gateData: GateData) => void;

export abstract class BaseGate<T extends GateData> {
    public abstract readonly gateType: GateType;
    public abstract readonly nodeType: GateNodeType;

    protected constructor(public readonly id: string, public readonly gateData: T) {
        this.gateData.name = `Gate ${this.id}`;
    }

    protected abstract onResetState() : void;

    public resetState() : void {
        this.gateData.name = `Gate ${this.id}`;
        this.onResetState();
    }

    protected abstract onCalculateState() : boolean;
    protected abstract propagateState() : Promise<void>;

    public async calculateState() : Promise<boolean> {
        const propagateState = this.onCalculateState();
        if(!propagateState)
            return false;

        await this.propagateState();
        return true;
    }

    public abstract getPin(nodeId: string) : Pin | null;

    protected abstract syncGateData() : void;
}
