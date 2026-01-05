import { type Gate } from "$lib/core";
import { playAudio } from "$lib/audio";
import { messageOverlay, type TitleMessageParams } from "$lib/overlays";

import { UniqueQueue } from "$lib/core/runtime/unique-queue";

export const minToggleLimit = 10, maxToggleLimit = 100;
export const minDeltaLimit = 1000, maxDeltaLimit = 10000;

function clamp(value: number, min: number, max: number) : number {
    return Math.min(Math.max(value, min), max);
}

async function error(params: TitleMessageParams) : Promise<void>{
    await Promise.allSettled([
        playAudio("error"),
        messageOverlay.open(params)
    ]);
}

const deltaLimitCrossParams = {
    title: "Delta Limit Crossed",
    message: "Delta limit crossed while calculating the state for the current cycle, this is most likely a possible combinational circuit."
} satisfies TitleMessageParams;

const toggleLimitCrossParams = {
    title: "Toggle Limit Crossed",
    message: "Toggle limit crossed while calculating the state for the current cycle, this is most likely a possible combinational circuit."
} satisfies TitleMessageParams;

let deltaLimit = minDeltaLimit;
let toggleLimit = minToggleLimit;

export function getDeltaLimit() : number {
    return deltaLimit;
}

export function setDeltaLimit(limit: number) : void {
    deltaLimit = clamp(limit, minDeltaLimit, maxDeltaLimit);
}

export function getToggleLimit() : number {
    return toggleLimit;
}

export function setToggleLimit(limit: number) : void {
    toggleLimit = clamp(limit, minToggleLimit, maxToggleLimit);
}

let locked = false;
let active = false;
let cycleDelta = 0;

const queue = new UniqueQueue<Gate>();
const updateMap = new Map<string, number>();

export function lockState() : boolean {
    return !locked && (locked = true);
}

export async function unlockState(processQueue: boolean) : Promise<void> {
    locked = false;
    if(processQueue)
        await processGateQueue();
    else
        queue.clear();
}

export async function pushGate(gate: Gate) : Promise<void> {
    queue.enqueue(gate);
    await processGateQueue();
}

async function processGateQueue() : Promise<void> {
    if(locked || active)
        return;

    active = true;
    while(queue.length > 0) {
        const gate = queue.dequeue();
        if(!gate)
            return;

        const calculated = await gate.calculateState();
        if(!calculated)
            continue;

        const safe = await logGateUpdate(gate);
        if(!safe) {
            cycleDelta = 0;

            queue.clear();
            updateMap.clear();
        }
    }

    cycleDelta = 0;
    updateMap.clear();
    active = false;
}

async function logGateUpdate(gate: Gate): Promise<boolean> {
    if(++cycleDelta >= deltaLimit) {
        await error(deltaLimitCrossParams);
        return false;
    }

    const count = updateMap.get(gate.id);
    if(!count) {
        updateMap.set(gate.id, 1);
        return true;
    }

    if(count + 1 >= toggleLimit) {
        await error(toggleLimitCrossParams);
        return false;
    }

    updateMap.set(gate.id, count + 1);
    return true;
}
