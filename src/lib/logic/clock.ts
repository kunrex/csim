import { ClockGate } from "$lib/logic/gates";

const frameRate = 0.5;
const clocks: ClockGate[] = [];

export function registerClock(clock: ClockGate) {
    clocks.push(clock);
}

let acc = 0;
let last = 0;
let state = false;

export async function masterTick(time: number) {
    const dt = (time - last) / 1000;
    last = time;

    acc += dt;

    while (acc >= frameRate) {
        state = !state;
        for (const clock of clocks)
            await clock.clockPulse(state);

        acc -= frameRate;
    }

    requestAnimationFrame(masterTick);
}