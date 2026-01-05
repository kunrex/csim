import { faClock, faLightbulb, faPowerOff } from "@fortawesome/free-solid-svg-icons";

import { MasterGatePool } from "$lib/pools";
import type { GateNodeType } from "$lib/flow";

import { InputPin, OutputPin, Pin } from "$lib/core/pins";
import { fromBoolean, invert, propagateObjectState, TriState } from "$lib/core/tri-state";
import { AndGateType, BufferGateType, ClockGateType, DisplayGateType, masterState, NandGateType, NorGateType, NotGateType, OrGateType, PowerGateType, ProbeGateType, pushGate, registerClock, UndefinedGateType, XnorGateType, XorGateType } from "$lib/core/runtime";

import type { GateType } from "$lib/core/gates/types";
import { BaseGate, type UpdateGateSignature } from "$lib/core/gates/base";
import type { PrefabGateData, SevenSegmentGateData } from "$lib/core/gates/data";
import { BinaryGate, InputGate, OutputGate, UnaryGate } from "$lib/core/gates/core";

export class NotGate extends UnaryGate {
    public readonly gateType: GateType = NotGateType;

    public constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, onUpdateFunction);
        this.gateData.type = this.gateType;
    }

    protected onCalculateState() : boolean {
        this.onCalculateSyncState();
        this.next = invert[this.in.objectState];

        return this.state != this.next;
    }

    public async propagateState() : Promise<void> {
        await this.onPropagateSyncState();
    }
}

export class AndGate extends BinaryGate {
    public readonly gateType: GateType = AndGateType;

    public constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, onUpdateFunction);
        this.gateData.type = this.gateType;
    }

    protected onCalculateState(): boolean {
        this.onCalculateSyncState();
        const in1 = this.in1.objectState;
        const in2 = this.in2.objectState;

        if(in1 === TriState.Low || in2 === TriState.Low)
            this.next = TriState.Low;
        else if (in1 === TriState.Unknown || in2 === TriState.Unknown)
            this.next = TriState.Unknown;
        else
            this.next = TriState.High;

        return this.state != this.next;
    }

    public async propagateState(): Promise<void> {
        await this.onPropagateSyncState();
    }
}

export class NandGate extends BinaryGate {
    public readonly gateType: GateType = NandGateType;

    public constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, onUpdateFunction);
        this.gateData.type = this.gateType;
    }

    protected onCalculateState() : boolean {
        this.onCalculateSyncState();
        const in1 = this.in1.objectState;
        const in2 = this.in2.objectState;

        if(in1 === TriState.Low || in2 === TriState.Low)
            this.next = TriState.High;
        else if (in1 === TriState.Unknown || in2 === TriState.Unknown)
            this.next = TriState.Unknown;
        else
            this.next = TriState.Low;

        return this.state != this.next;
    }

    public async propagateState() : Promise<void> {
        await this.onPropagateSyncState();
    }
}

export class OrGate extends BinaryGate {
    public readonly gateType: GateType = OrGateType;

    public constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, onUpdateFunction);
        this.gateData.type = this.gateType;
    }

    protected onCalculateState() : boolean {
        this.onCalculateSyncState();
        const in1 = this.in1.objectState;
        const in2 = this.in2.objectState;

        if(in1 === TriState.High || in2 === TriState.High)
            this.next = TriState.High;
        else if (in1 === TriState.Unknown || in2 === TriState.Unknown)
            this.next = TriState.Unknown;
        else
            this.next = TriState.Low;

        return this.state != this.next;
    }

    public async propagateState() : Promise<void> {
        await this.onPropagateSyncState();
    }
}

export class NorGate extends BinaryGate {
    public readonly gateType: GateType = NorGateType;

    public constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, onUpdateFunction);
        this.gateData.type = this.gateType;
    }

    protected onCalculateState() : boolean {
        this.onCalculateSyncState();
        const in1 = this.in1.objectState;
        const in2 = this.in2.objectState;

        if(in1 === TriState.High || in2 === TriState.High)
            this.next = TriState.Low;
        else if (in1 === TriState.Unknown || in2 === TriState.Unknown)
            this.next = TriState.Unknown;
        else
            this.next = TriState.High;

        return this.state != this.next;
    }

    public async propagateState() : Promise<void> {
        await this.onPropagateSyncState();
    }
}

export class XorGate extends BinaryGate {
    public readonly gateType: GateType = XorGateType;

    public constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, onUpdateFunction);
        this.gateData.type = this.gateType;
    }

    protected onCalculateState() : boolean {
        this.onCalculateSyncState();
        const in1 = this.in1.objectState;
        const in2 = this.in2.objectState;

        if (in1 === TriState.Unknown || in2 === TriState.Unknown)
            this.next = TriState.Unknown;
        else
            this.next = fromBoolean(in1 != in2);

        return this.state != this.next;
    }

    public async propagateState() : Promise<void> {
        await this.onPropagateSyncState();
    }
}

export class XNorGate extends BinaryGate {
    public readonly gateType: GateType = XnorGateType;

    public constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, onUpdateFunction);
        this.gateData.type = this.gateType;
    }

    protected onCalculateState() : boolean {
        this.onCalculateSyncState();
        const in1 = this.in1.objectState;
        const in2 = this.in2.objectState;

        if (in1 === TriState.Unknown || in2 === TriState.Unknown)
            this.next = TriState.Unknown;
        else
            this.next = fromBoolean(in1 == in2);

        return this.state != this.next;
    }

    public async propagateState() : Promise<void> {
        await this.onPropagateSyncState();
    }
}

export class PowerGate extends OutputGate {
    public readonly gateType: GateType = PowerGateType;

    public constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, onUpdateFunction);
        this.gateData.icon = faPowerOff;
        this.gateData.type = this.gateType;
        this.gateData.toggle = () => pushGate(this);

        this.state = TriState.Low;
    }

    protected onResetState() {
        super.onResetState();
        this.next = this.state = TriState.Low;
    }

    protected onCalculateState() : boolean {
        this.onCalculateSyncState();
        this.next = fromBoolean(!this.state);

        return true;
    }

    public async propagateState() : Promise<void> {
        this.state = this.next;

        if(this.state == TriState.High) {
            await this.out.propagateHigh();
            this.gateData.out1 = true;
        }
        else {
            await this.out.propagateLow();
            this.gateData.out1 = false;
        }

        this.syncGateData();
    }
}

export class ProbeGate extends InputGate {
    public readonly gateType: GateType = ProbeGateType;

    public constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, onUpdateFunction);
        this.gateData.icon = faLightbulb;
        this.gateData.type = this.gateType;
    }

    protected onCalculateState() : boolean {
        this.onCalculateSyncState();
        return false;
    }

    public propagateState() : Promise<void> {
        return Promise.resolve();
    }
}

export class ClockGate extends OutputGate {
    private enabled: boolean = false;

    public readonly gateType: GateType = ClockGateType;

    public constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, onUpdateFunction);
        this.gateData.icon = faClock;
        this.gateData.type = this.gateType;
        this.gateData.toggle = () => this.toggleClock();

        registerClock(this);
        this.state = TriState.Low;
    }

    protected onResetState() {
        super.onResetState();
        this.enabled = false;
        this.next = this.state = TriState.Low;
    }

    protected onCalculateState() : boolean {
        this.onCalculateSyncState();
        this.next = fromBoolean(!this.next);

        return true;
    }

    public async propagateState() : Promise<void> {
        if(this.enabled)
            await this.onPropagateSyncState();
    }

    public async toggleClock(): Promise<void> {
        if(this.enabled) {
            this.enabled = false;
            this.next = TriState.Low;

            await this.onPropagateSyncState();
        } else {
            this.next = fromBoolean(masterState());
            this.enabled = true;
        }
    }
}

export class SevenSegmentDisplay extends BaseGate<SevenSegmentGateData> {
    public readonly gateType: GateType = DisplayGateType;
    public readonly nodeType: GateNodeType = "display";

    private readonly in1 = new InputPin("in-1", this);
    private readonly in2 = new InputPin("in-2", this);
    private readonly in3 = new InputPin("in-3", this);
    private readonly in4 = new InputPin("in-4", this);
    private readonly in5 = new InputPin("in-5", this);

    private readonly out1 = new OutputPin("out-1");
    private readonly out2 = new OutputPin("out-2");
    private readonly out3 = new OutputPin("out-3");
    private readonly out4 = new OutputPin("out-4");
    private readonly out5 = new OutputPin("out-5");

    private next = 0;
    private state = 0;

    constructor(id: string, private readonly onUpdateFunction: UpdateGateSignature) {
        super(id, {
            name: "",
            type: UndefinedGateType,
            icon: undefined,

            in1: false,
            in2: false,
            in3: false,
            in4: false,
            in5: false,

            value: 0
        } satisfies SevenSegmentGateData);
        this.gateData.type = this.gateType;
    }

    protected syncGateData(): void {
        this.onUpdateFunction(this.id, this.gateData);
    }

    protected onResetState(): void {
        this.in1.reset();
        this.in2.reset();
        this.in3.reset();
        this.in4.reset();
        this.in5.reset();
        this.gateData.in1 = false;
        this.gateData.in2 = false;
        this.gateData.in3 = false;
        this.gateData.in4 = false;
        this.gateData.in5 = false;
    }

    protected onCalculateState(): boolean {
        const in1 = this.gateData.in1 = this.in1.objectState === TriState.High;
        const in2 = this.gateData.in2 = this.in2.objectState === TriState.High;
        const in3 = this.gateData.in3 = this.in3.objectState === TriState.High;
        const in4 = this.gateData.in4 = this.in4.objectState === TriState.High;
        this.gateData.in5 = this.in5.objectState === TriState.High;

        this.next = this.gateData.value = +in1 + (+in2 << 1) + (+in3 << 2) + (+in4 << 3);

        this.syncGateData();
        return this.state != this.next;
    }

    protected async propagateState(): Promise<void> {
        this.state = this.next;

        await propagateObjectState(this.in1, this.out1);
        await propagateObjectState(this.in2, this.out2);
        await propagateObjectState(this.in3, this.out3);
        await propagateObjectState(this.in4, this.out4);
        await propagateObjectState(this.in5, this.out5);
    }

    public getPin(id: string): Pin | null {
        switch(id) {
            case this.in1.id:
                return this.in1;
            case this.in2.id:
                return this.in2;
            case this.in3.id:
                return this.in3;
            case this.in4.id:
                return this.in4;
            case this.in5.id:
                return this.in5;
            case this.out1.id:
                return this.out1;
            case this.out2.id:
                return this.out2;
            case this.out3.id:
                return this.out3;
            case this.out4.id:
                return this.out4;
            case this.out5.id:
                return this.out5;
            default:
                return null;
        }
    }
}

export class BufferGate extends UnaryGate {
    public readonly gateType: GateType = BufferGateType;

    public constructor(id: string, updateFunction: UpdateGateSignature) {
        super(id, updateFunction);
        this.gateData.type = this.gateType;
    }

    protected onCalculateState(): boolean {
        this.onCalculateSyncState();
        this.next = this.in.objectState;

        return this.state != this.next;
    }

    public async propagateState(): Promise<void> {
        await this.onPropagateSyncState();
    }

    protected onResetState(): void {
        super.onResetState();
        this.gateData.icon = this.gateData.hideInput = this.gateData.hideOutput = undefined;
    }
}

export class PrefabGate extends BaseGate<PrefabGateData> {
    public gateType: GateType = UndefinedGateType;
    public readonly nodeType: GateNodeType = "prefab";

    public constructor(id: string, private readonly onUpdateFunction: UpdateGateSignature) {
        super(id, {
            name: "",
            type: UndefinedGateType,
            icon: undefined,

            expanded: false,

            bufferMap: new Map(),
            displaySet: new Set()
        } satisfies PrefabGateData);
    }

    protected syncGateData() : void {
        this.onUpdateFunction(this.id, this.gateData);
    }

    protected onCalculateState() : boolean {
        this.syncGateData();
        return false;
    }

    protected propagateState() : Promise<void> {
        return Promise.resolve();
    }

    protected onResetState() : void {
        this.gateData.type = UndefinedGateType;
        this.gateData.icon = undefined;

        this.gateData.expanded = false;

        this.gateData.bufferMap.clear();
        this.gateData.displaySet.clear();
    }

    public getPin(pinId: string) : Pin | null {
        for(const pair of this.gateData.bufferMap) {
            if(pinId == pair[1].pin) {
                const gate = MasterGatePool.instance.getGate(pair[0]);
                if(!gate)
                    return null;

                switch (pair[1].type) {
                    case "power":
                    case "clock":
                        return gate.getPin("in-1");
                    case "probe":
                        return gate.getPin("out-1");
                    default:
                        return null;
                }
            }
        }

        return null;
    }
}