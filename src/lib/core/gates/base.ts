import type { GateNodeType } from "$lib/flow";

import { Pin } from "$lib/core/pins";
import { CycleGuard } from "$lib/core/runtime";

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

    protected abstract onResetState(): Promise<void>;

    public async resetState(): Promise<void> {
        this.gateData.name = `Gate ${this.id}`;
        await this.onResetState();
    }

    protected abstract propagateState(): Promise<void>;
    protected abstract onCalculateState(): Promise<void>;

    public async calculateState() : Promise<void> {
        await this.onCalculateState();
        if(!await CycleGuard.instance.logGateUpdate(this))
            return;

        await this.propagateState();
    }

    public abstract getPin(nodeId: string): Pin | null;

    protected abstract onSyncGateData(): void;

    protected syncGateData(): void {
        this.onSyncGateData();
    }
}
