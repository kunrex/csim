import { ClockGate } from "$lib/logic/gates";
import {LoopGuard} from "$lib/logic/cycles/loop-guard";

const frameRate = 0.5;
const clocks: ClockGate[] = [];

export function registerClock(clock: ClockGate) {
    clocks.push(clock);
}

let acc = 0;
let last = 0;
let state = false;

export function masterState(): boolean {
    return state;
}

export async function masterTick(time: number): Promise<void> {
    const dt = (time - last) / 1000;
    last = time;

    acc += dt;

    while (acc >= frameRate) {
        state = !state;

        LoopGuard.instance.resetCycle();
        for (const clock of clocks)
            await clock.calculateState();

        acc -= frameRate;
    }

    requestAnimationFrame(masterTick);
}
