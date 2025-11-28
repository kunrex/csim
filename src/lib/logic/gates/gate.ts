import type { UpdateGateSignature } from "$lib/circuit";

import { Handle, InHandle, OutHandle } from "$lib/logic";
import type { GateType, GateData } from "$lib/logic/types";

import { flipThreshold } from "$lib/logic/constants";
import type { IIdentity } from "$lib/logic/interfaces";

export abstract class Gate implements IIdentity {
    private then: number = 0;

    public abstract gateType(): GateType;

    protected constructor(public readonly id: string, public readonly gateData: GateData, public updateNodeFunction: UpdateGateSignature) {
        this.then = performance.now();
    }

    public abstract enabled(): boolean;

    public abstract reset(): Promise<void>;
    
    public abstract enable(): Promise<void>;
    public disable(): Promise<void> { return Promise.resolve(); }

    public abstract getNode(id: string) : Handle | null;

    public setInputConnected(id: string, state: boolean) : void {
        this.gateData[`${id}-connected`] = state;
        this.syncGateData();
    }

    protected syncGateData() : void {
        this.updateNodeFunction(this.id, this.gateData);
    }

    protected rapidFlipCheck() : boolean {
        const now = performance.now();
        const result = now - this.then <= flipThreshold;
        this.then = now;
        return result;
    }
}

export abstract class BinaryGate extends Gate {
    protected state: boolean = false;

    public readonly in1: InHandle = new InHandle("in-1", this);
    public readonly in2: InHandle = new InHandle("in-2", this);

    public readonly out: OutHandle = new OutHandle("out-1");
    
    public enabled() : boolean { return this.state; }

    protected constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    protected async check(prev: boolean) : Promise<void> {
        this.gateData["in-1"] = this.in1.enabled();
        this.gateData["in-2"] = this.in2.enabled();

        this.syncGateData();

        if(this.rapidFlipCheck())
            return;

        if(this.state == prev)
            return;

        if(this.state)
            await this.out.enable();
        else
            await this.out.disable();

        this.gateData["out-1"] = this.out.enabled();
        this.syncGateData();
    }

    public async reset(): Promise<void> {
        await this.in1.reset();
        await this.in2.reset();
        this.gateData["in-1-connected"] = false;
        this.gateData["in-2-connected"] = false;

        await this.out.reset();
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