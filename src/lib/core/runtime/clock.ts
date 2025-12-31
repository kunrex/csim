import { ClockGate } from "$lib/core/gates";
import { CycleGuard } from "$lib/core/runtime/cycle-guard";

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

        CycleGuard.instance.resetCycle();
        for (const clock of clocks)
            await clock.calculateState();

        acc -= frameRate;
    }

    requestAnimationFrame(masterTick);
}
