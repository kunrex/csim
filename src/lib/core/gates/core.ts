import type {GateNodeType} from "$lib/flow";

import {TriState} from "$lib/core/tri-state";
import {UndefinedGateType} from "$lib/core/runtime";
import {InputPin, OutputPin, Pin} from "$lib/core/pins";

import {BaseGate, type UpdateGateSignature} from "$lib/core/gates/base";
import type {
    BinaryGateData,
    GateData,
    InputGateData,
    OutputGateData,
    UnaryGateData,
    UnaryOutputData
} from "$lib/core/gates/data";

abstract class CoreGate<T extends GateData> extends BaseGate<T> {
    protected constructor(id: string, gateData: T, protected readonly onUpdateFunction: UpdateGateSignature) {
        super(id, gateData);
    }

    protected onSyncGateData(): void {
        this.onUpdateFunction(this.id, this.gateData);
    }

    protected abstract onCalculateSyncState(): void;
    protected abstract onPropagateSyncState(): Promise<void>;
}

abstract class SingleOutputGate<T extends UnaryOutputData> extends CoreGate<T> {
    protected next: TriState = TriState.Unknown;
    protected state: TriState = TriState.Unknown;

    public readonly out: OutputPin = new OutputPin("out-1");

    protected onResetState(): Promise<void> {
        this.next = this.state = TriState.Unknown;
        return Promise.resolve();
    }

    protected async onPropagateSyncState(): Promise<void> {
        if(this.state == this.next)
            return;

        this.state = this.next;
        switch (this.state) {
            case TriState.Low:
                await this.out.propagateLow();
                break;
            case TriState.High:
                await this.out.propagateHigh();
                break;
            default:
                await this.out.propagateUnknown();
                break;
        }

        this.gateData.out1 = this.out.getState() == TriState.High;
        this.syncGateData();
        return;
    }
}

export abstract class UnaryGate extends SingleOutputGate<UnaryGateData> {
    public readonly nodeType: GateNodeType = "unary";

    public readonly in: InputPin = new InputPin("in-1", this);

    protected constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, {
            name: "",
            type: UndefinedGateType,
            icon: undefined,

            in1: false,
            out1: false,
        }, onUpdateFunction);
    }

    protected async onResetState(): Promise<void> {
        await super.onResetState();

        await this.in.reset();
        await this.out.reset();

        this.gateData.in1 = false;
        this.gateData.out1 = false;

        this.gateData.icon = this.gateData.hideInput = this.gateData.hideOutput = undefined;
    }

    protected onCalculateSyncState(): void {
        this.gateData.in1 = this.in.getState() == TriState.High;
        this.syncGateData();
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

export abstract class BinaryGate extends SingleOutputGate<BinaryGateData> {
    public readonly nodeType: GateNodeType = "binary";

    public readonly in1: InputPin = new InputPin("in-1", this);
    public readonly in2: InputPin = new InputPin("in-2", this);

    protected constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, {
            name: "",
            type: UndefinedGateType,
            icon: undefined,

            in1: false,
            in2: false,
            out1: false,
        }, onUpdateFunction);
    }

    protected async onResetState(): Promise<void> {
        await super.onResetState();

        await this.in1.reset();
        await this.in2.reset();
        this.gateData.in1 = false;
        this.gateData.in2 = false;

        await this.out.reset();
        this.gateData.out1 = false;
    }

    protected onCalculateSyncState(): void {
        this.gateData.in1 = this.in1.getState() == TriState.High;
        this.gateData.in2 = this.in2.getState() == TriState.High;
        this.syncGateData();
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
            type: UndefinedGateType,
            icon: undefined,

            in1: false,
        }, onUpdateFunction);
    }

    protected async onResetState(): Promise<void> {
        await this.in.reset();
        this.gateData.in1 = false;
    }

    protected onCalculateSyncState(): void {
        this.gateData.in1 = this.in.getState() == TriState.High;
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

export abstract class OutputGate extends SingleOutputGate<OutputGateData> {
    public readonly nodeType: GateNodeType = "s-output";

    protected constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, {
            name: "",
            type: UndefinedGateType,
            icon: undefined,

            out1: false,
        }, onUpdateFunction);
    }

    protected async onResetState(): Promise<void> {
        this.state = this.next = TriState.Low;

        this.gateData.out1 = false;
        await this.out.reset();
    }

    protected onCalculateSyncState(): void { }

    public getPin(id: string): Pin | null {
        switch (id) {
            case this.out.id:
                return this.out;
            default:
                return null;
        }
    }
}