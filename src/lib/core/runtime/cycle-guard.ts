import { messageController, type TitleMessageParams } from "$lib/overlays";

import { type Gate } from "$lib/core/gates";

export const minToggleLimit = 10, maxToggleLimit = 100;
export const minDeltaLimit = 1000, maxDeltaLimit = 10000;

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

const deltaLimitCrossParams = {
    title: "Delta Limit Crossed",
    message: "Delta limit crossed while calculating the state for the current cycle, this is most likely a possible combinational circuit."
} satisfies TitleMessageParams;

const toggleLimitCrossParams = {
    title: "Toggle Limit Crossed",
    message: "Toggle limit crossed while calculating the state for the current cycle, this is most likely a possible combinational circuit."
} satisfies TitleMessageParams;

export class CycleGuard {
    public static instance = new CycleGuard();

    private static deltaLimit: number = minDeltaLimit;
    private static toggleLimit: number = minToggleLimit;

    public static getDeltaLimit(): number {
        return this.deltaLimit;
    }

    public static setDeltaLimit(limit: number) {
        CycleGuard.deltaLimit = clamp(limit, minDeltaLimit, maxDeltaLimit);
    }

    public static getToggleLimit(): number {
        return this.toggleLimit;
    }

    public static setToggleLimit(limit: number) {
        CycleGuard.deltaLimit = clamp(limit, minToggleLimit, maxToggleLimit);
    }

    private delta = 0;
    private updateMap = new Map<string, number>();

    private constructor() { }

    public resetCycle(): void {
        this.delta = 0;
        this.updateMap.clear();
    }

    public async logGateUpdate(gate: Gate): Promise<boolean> {
        if(++this.delta >= CycleGuard.deltaLimit) {
            this.resetCycle();
            await messageController.open(deltaLimitCrossParams);
            return false;
        }

        const count = this.updateMap.get(gate.id);
        if(!count) {
            this.updateMap.set(gate.id, 1);
            return true;
        }

        if(count + 1 >= CycleGuard.toggleLimit) {
            this.resetCycle();
            await messageController.open(toggleLimitCrossParams);
            return false;
        }

        this.updateMap.set(gate.id, count + 1);
        return true;
    }
}
