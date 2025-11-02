import type { GateData, UpdateSignature } from "$lib/circuit";

import { Handle, InHandle, OutHandle } from "$lib/logic";

import type { IIdentity } from "$lib/logic/interfaces";
import { shortCircuitThreshold } from "$lib/logic/constants";

export abstract class Gate implements IIdentity {
    protected state: boolean = false;

    public abstract inCount() : number;
    public abstract outCount(): number;

    protected constructor(public id: string, public readonly gateData: GateData, protected readonly onUpdateFunction: UpdateSignature) { }

    protected syncGameData() : void {
        this.onUpdateFunction(this.id, (node: any) => ({
            ...node,
            data: this.gateData
        }));
    }

    public enabled(): boolean {
        return this.state;
    }

    public disable(): Promise<void> { return Promise.resolve(); }
    public abstract enable(): Promise<void>;

    public abstract getNode(id: string) : Handle | null;
}

export abstract class BinaryGate extends Gate {
    public readonly in1: InHandle = new InHandle("in-1", this);
    public readonly in2: InHandle = new InHandle("in-2", this);

    public readonly out: OutHandle = new OutHandle("out-1");

    private lastCheck: number = 0;

    protected constructor(id: string, gateData: GateData, onUpdateFunction: UpdateSignature) {
        super(id, gateData, onUpdateFunction);
        this.lastCheck = performance.now();
    }

    protected async check(prev: boolean) : Promise<void> {
        this.gateData["in-1"] = this.in1.enabled();
        this.gateData["in-2"] = this.in2.enabled();
        this.syncGameData();

        if(performance.now() - this.lastCheck < shortCircuitThreshold) {
            console.log("hello")
            return
        }

        this.lastCheck = performance.now();
        if(this.state == prev)
            return;

        if(this.state)
            await this.out.enable();
        else
            await this.out.disable();

        this.gateData["out-1"] = this.out.enabled();
        this.syncGameData();
    }

    public getNode(id: string): Handle | null {
        switch (id) {
            case this.in2.id:
                return this.in2;
            case this.in1.id:
                return this.in1;
            case this.out.id:
                return this.out;
            default:
                return null;
        }
    }
}