import { ClockGate } from "$lib/logic/gates";
import {onMount} from "svelte";

const frameRate: number = 0.5;

export class MasterClock {
    public static instance: MasterClock = new MasterClock();

    private acc: number = 0;
    private then: number = 0;
    private state: boolean = false;
    private clocks: ClockGate[] = [];

    private constructor() { }

    public registerClock(gate: ClockGate) : void {
        this.clocks.push(gate);
    }

    public startCycle() {
        requestAnimationFrame(() => { this.clockLoop(0); });
    }

    private clockLoop(time: number) : void {
        let dt = (time - this.then) / 1000;
        this.then += time;
        this.acc += dt;

        this.state = !this.state;

        while(this.acc >= frameRate) {
            const length = this.clocks.length;
            for(let i = 0; i < length; i++)
                this.clocks[i].clockPulse(this.state);

            this.acc -= frameRate;
        }

        requestAnimationFrame(this.clockLoop);
    }
}
