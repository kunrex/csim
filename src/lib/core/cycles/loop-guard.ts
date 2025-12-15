import { type Gate } from "$lib/core/gates";
import {loopGuardOverlay, messageOverlay} from "$lib";

export const minToggleLimit = 10, maxToggleLimit = 100;
export const minDeltaLimit = 1000, maxDeltaLimit = 10000;

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

export class LoopGuard {
    public static instance = new LoopGuard();

    private static deltaLimit: number = minDeltaLimit;
    private static toggleLimit: number = minToggleLimit;

    public static getDeltaLimit(): number {
        return this.deltaLimit;
    }

    public static setDeltaLimit(limit: number) {
        LoopGuard.deltaLimit = clamp(limit, minDeltaLimit, maxDeltaLimit);
    }

    public static getToggleLimit(): number {
        return this.toggleLimit;
    }

    public static setToggleLimit(limit: number) {
        LoopGuard.deltaLimit = clamp(limit, minToggleLimit, maxToggleLimit);
    }

    private delta = 0;
    private updateMap = new Map<string, number>();

    private constructor() { }

    public resetCycle(): void {
        this.delta = 0;
        this.updateMap.clear();
    }

    public logGateUpdate(gate: Gate): boolean {
        if(++this.delta >= LoopGuard.deltaLimit) {
            this.resetCycle();
            messageOverlay.open({ title: "Delta Limit Crossed", message: `Delta limit crossed while calculating the state for the current cycle... possible combinational circuit detected.`});
            return false;
        }

        const count = this.updateMap.get(gate.id);
        if(!count) {
            this.updateMap.set(gate.id, 1);
            return true;
        }

        if(count + 1 >= LoopGuard.toggleLimit) {
            this.resetCycle();
            messageOverlay.open({ title: "Toggle Limit Crossed", message: `Toggle limit crossed while calculating the state for the current cycle... possible combinational circuit detected.`});
            return false;
        }

        this.updateMap.set(gate.id, count + 1);
        return true;
    }
}
