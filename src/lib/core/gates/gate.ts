import type { GateNodeType } from "$lib/flow";

import { LoopGuard } from "$lib/core/cycles";
import { Pin, InputPin, OutputPin } from "$lib/core/pin";
import type { GateType, GateData, UpdateGateSignature } from "$lib/core/types";
import type { BinaryGateData, InputGateData, OutputGateData, UnaryGateData } from "$lib/core/types/gate-data";

export type Gate = BaseGate<GateData>;

export abstract class BaseGate<T extends GateData> {
    public abstract readonly gateType: GateType;
    public abstract readonly nodeType: GateNodeType;

    protected constructor(public readonly id: string, public readonly gateData: T) {
        this.gateData.name = `Gate ${this.id}`;
    }

    protected abstract onResetState(): Promise<void>;

    public async resetState(): Promise<void> {
        this.gateData.name = `Gate ${this.id}`;
        await this.onResetState();
    }

    protected abstract propagateState(): Promise<void>;
    protected abstract onCalculateState(): Promise<void>;

    public async calculateState() : Promise<void> {
        await this.onCalculateState();
        if(!LoopGuard.instance.logGateUpdate(this))
            return;

        await this.propagateState();
    }

    public abstract getPin(nodeId: string): Pin | null;

    protected abstract onSyncGateData(): void;

    protected syncGateData(): void {
        this.onSyncGateData();
    }
}

export abstract class CoreGate<T extends GateData> extends BaseGate<T> {
    protected constructor(id: string, gateData: T, protected readonly onUpdateFunction: UpdateGateSignature) {
        super(id, gateData);
    }

    protected onSyncGateData(): void {
        this.onUpdateFunction(this.id, this.gateData);
    }

    protected abstract onCalculateSyncState(): void;
    protected abstract onPropagateSyncState(): Promise<void>;
}

export abstract class UnaryGate extends CoreGate<UnaryGateData> {
    protected next: boolean = false;
    protected state: boolean = false;

    public readonly nodeType: GateNodeType = "unary";

    public readonly in: InputPin = new InputPin("in-1", this);

    public readonly out: OutputPin = new OutputPin("out-1");

    protected constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, {
            name: "",
            type: "",
            icon: undefined,

            in1: false,
            out1: false,
        }, onUpdateFunction);
    }

    protected async onResetState(): Promise<void> {
        await this.in.reset();
        await this.out.reset();

        this.gateData.in1 = false;
        this.gateData.out1 = false;

        this.gateData.icon = this.gateData.hideInput = this.gateData.hideOutput = undefined;
    }

    protected onCalculateSyncState(): void {
        this.gateData.in1 = this.in.enabled();
        this.syncGateData();
    }

    protected async onPropagateSyncState(): Promise<void> {
        if(!this.in.isConnected() || this.state == this.next)
            return;

        this.state = this.next;
        if(this.state)
            await this.out.enable();
        else
            await this.out.disable();

        this.gateData.out1 = this.out.enabled();
        this.syncGateData();
        return;
    }

    public getPin(nodeId: string): Pin | null {
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

export abstract class BinaryGate extends CoreGate<BinaryGateData> {
    protected next: boolean = false;
    protected state: boolean = false;

    public readonly nodeType: GateNodeType = "binary";

    public readonly in1: InputPin = new InputPin("in-1", this);
    public readonly in2: InputPin = new InputPin("in-2", this);

    public readonly out: OutputPin = new OutputPin("out-1");

    protected constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, {
            name: "",
            type: "",
            icon: undefined,

            in1: false,
            in2: false,
            out1: false,
        }, onUpdateFunction);
    }

    protected async onResetState(): Promise<void> {
        await this.in1.reset();
        await this.in2.reset();
        this.gateData.in1 = false;
        this.gateData.in2 = false;

        this.gateData.out1 = false;
        await this.out.reset();
    }

    protected onCalculateSyncState(): void {
        this.gateData.in1 = this.in1.enabled();
        this.gateData.in2 = this.in2.enabled();

        this.syncGateData();
    }

    protected async onPropagateSyncState(): Promise<void> {
        if(!this.in1.isConnected() || !this.in2.isConnected() || this.state == this.next)
            return;

        this.state = this.next;
        if(this.state)
            await this.out.enable();
        else
            await this.out.disable();

        this.gateData.out1 = this.out.enabled();
        this.syncGateData();
        return;
    }

    public getPin(id: string): Pin | null {
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

export abstract class InputGate extends CoreGate<InputGateData> {
    public readonly in: InputPin = new InputPin("in-1", this);

    public readonly nodeType: GateNodeType = "s-input";

    protected constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, {
            name: "",
            type: "",
            icon: undefined,

            in1: false,
        }, onUpdateFunction);
    }

    protected async onResetState(): Promise<void> {
        await this.in.reset();
        this.gateData.in1 = false;
    }

    protected onCalculateSyncState(): void {
        this.gateData.in1 = this.in.enabled();

        this.syncGateData();
    }

    protected onPropagateSyncState(): Promise<void> {
        return Promise.resolve();
    }

    public getPin(id: string): Pin | null {
        switch (id) {
            case this.in.id:
                return this.in;
            default:
                return null;
        }
    }
}

export abstract class OutputGate extends CoreGate<OutputGateData> {
    protected next: boolean = false;
    protected state: boolean = false;

    public readonly nodeType: GateNodeType = "s-output";

    public readonly out: OutputPin = new OutputPin("out-1");

    protected constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, {
            name: "",
            type: "",
            icon: undefined,

            out1: false,
        }, onUpdateFunction);
    }

    protected async onResetState(): Promise<void> {
        this.gateData.out1 = false;
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

        this.gateData.ou1 = this.out.enabled();
        this.syncGateData();
    }

    public getPin(id: string): Pin | null {
        switch (id) {
            case this.out.id:
                return this.out;
            default:
                return null;
        }
    }
}