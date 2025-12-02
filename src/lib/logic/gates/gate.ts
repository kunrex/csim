import type { UpdateGateSignature } from "$lib/circuit";

import { LoopGuard } from "$lib/logic/cycles";
import type { GateType, GateData } from "$lib/logic/types";
import { Handle, InHandle, OutHandle } from "$lib/logic/handle";

export abstract class Gate {
    public sync: boolean = true;
    public abstract gateType(): GateType;

    protected constructor(public readonly id: string, public readonly gateData: GateData) { }

    public abstract resetState(): Promise<void>;

    protected abstract propagateState(): Promise<void>;
    protected abstract onCalculateState(): Promise<void>;

    public async calculateState() : Promise<void> {
        await this.onCalculateState();
        if(!LoopGuard.instance.logGateUpdate(this))
            return;

        await this.propagateState();
    }

    public abstract getNode(nodeId: string): Handle | null;

    protected syncGateData(): void {
        if(this.sync)
            this.onSyncGateData();
    }

    protected abstract onSyncGateData(): void;

    public setInputConnected(id: string, state: boolean) : void {
        this.gateData[`${id}-connected`] = state;
        this.syncGateData();
    }
}

export abstract class CoreGate extends Gate {
    protected constructor(id: string, gateData: GateData, protected readonly onUpdateFunction: UpdateGateSignature) {
        super(id, gateData);
    }

    protected onSyncGateData(): void {
        this.onUpdateFunction(this.id, this.gateData);
    }

    protected abstract onCalculateSyncState(): void;
    protected abstract onPropagateSyncState(): Promise<void>;
}

export abstract class UnaryGate extends CoreGate {
    protected next: boolean = false;
    protected state: boolean = false;

    public readonly in: InHandle = new InHandle("in-1", this);

    public readonly out: OutHandle = new OutHandle("out-1");

    protected constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public async resetState(): Promise<void> {
        await this.in.reset();
        this.gateData["in-1"] = false;
        this.gateData["in-1-connected"] = false;

        this.gateData["out-1"] = false;
        await this.out.reset();
    }

    protected onCalculateSyncState(): void {
        this.gateData["in-1"] = this.in.enabled();
        this.syncGateData();
    }

    protected async onPropagateSyncState(): Promise<void> {
        if(this.state == this.next)
            return;

        this.state = this.next;
        if(this.state)
            await this.out.enable();
        else
            await this.out.disable();

        this.gateData["out-1"] = this.out.enabled();
        this.syncGateData();
        return;
    }

    public getNode(nodeId: string): Handle | null {
        switch (nodeId) {
            case this.in.id:
                return this.in;
            case this.out.id:
                return this.out;
            default:
                return null;
        }
    }
}

export abstract class BinaryGate extends CoreGate {
    protected next: boolean = false;
    protected state: boolean = false;

    public readonly in1: InHandle = new InHandle("in-1", this);
    public readonly in2: InHandle = new InHandle("in-2", this);

    public readonly out: OutHandle = new OutHandle("out-1");

    protected constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public async resetState(): Promise<void> {
        await this.in1.reset();
        await this.in2.reset();
        this.gateData["in-1"] = false;
        this.gateData["in-2"] = false;
        this.gateData["in-1-connected"] = false;
        this.gateData["in-2-connected"] = false;

        this.gateData["out-1"] = false;
        await this.out.reset();
    }

    protected onCalculateSyncState(): void {
        this.gateData["in-1"] = this.in1.enabled();
        this.gateData["in-2"] = this.in2.enabled();

        this.syncGateData();
    }

    protected async onPropagateSyncState(): Promise<void> {
        if(this.state == this.next)
            return;

        this.state = this.next;
        if(this.state)
            await this.out.enable();
        else
            await this.out.disable();

        this.gateData["out-1"] = this.out.enabled();
        this.syncGateData();
        return;
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

export abstract class InputGate extends CoreGate {
    public readonly in: InHandle = new InHandle("in-1", this);

    protected constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public async resetState(): Promise<void> {
        await this.in.reset();
        this.gateData["in-1"] = false;
        this.gateData["in-1-connected"] = false;
    }

    protected onCalculateSyncState(): void {
        this.gateData["in-1"] = this.in.enabled();

        this.syncGateData();
    }

    protected onPropagateSyncState(): Promise<void> {
        return Promise.resolve();
    }

    public getNode(id: string): Handle | null {
        switch (id) {
            case this.in.id:
                return this.in;
            default:
                return null;
        }
    }
}

export abstract class OutputGate extends CoreGate {
    protected next: boolean = false;
    protected state: boolean = false;

    public readonly out: OutHandle = new OutHandle("out-1");

    protected constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public async resetState(): Promise<void> {
        this.gateData["out-1"] = false;
        await this.out.reset();
    }

    protected onCalculateSyncState(): void { }

    protected async onPropagateSyncState(): Promise<void> {
        if(this.state == this.next)
            return;

        this.state = this.next;
        if(this.state)
            await this.out.enable();
        else
            await this.out.disable();

        this.gateData["out-1"] = this.out.enabled();
        this.syncGateData();
    }

    public getNode(id: string): Handle | null {
        switch (id) {
            case this.out.id:
                return this.out;
            default:
                return null;
        }
    }
}