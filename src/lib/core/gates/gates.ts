import { faClock, faLightbulb, faPowerOff } from "@fortawesome/free-solid-svg-icons";

import { deleteGate } from "$lib/pools";

import {CoreGateData, type GateNodeType, type UpdateGateSignature} from "../../flow";

import { Handle, InHandle } from "$lib/core/handle";
import {type GateData, type GateType, HandleWrapper} from "$lib/core/types";
import { LoopGuard, masterState, registerClock } from "$lib/core/cycles";
import { BinaryGate, Gate, InputGate, OutputGate, UnaryGate } from "$lib/core/gates/gate";

export class NotGate extends UnaryGate {
    public readonly gateType: GateType = "not";

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);

        gateData["gate"] = "Not";
        gateData["color"] = "color-not";
    }

    public async onCalculateState(): Promise<void> {
        this.onCalculateSyncState();
        this.next = !this.in.enabled();

        return Promise.resolve();
    }

    public async propagateState(): Promise<void> {
        await this.onPropagateSyncState();
    }
}

export class AndGate extends BinaryGate {
    public readonly gateType: GateType = "and";

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);

        gateData["gate"] = "And";
        gateData["color"] = "color-and";
    }

    public async onCalculateState(): Promise<void> {
        this.onCalculateSyncState();
        this.next = this.in1.enabled() && this.in2.enabled();

        return Promise.resolve();
    }

    public async propagateState(): Promise<void> {
        await this.onPropagateSyncState();
    }
}

export class NAndGate extends BinaryGate {
    public readonly gateType: GateType = "nand";

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);

        gateData["gate"] = "Nand";
        gateData["color"] = "color-nand";
    }

    public async onCalculateState(): Promise<void> {
        this.onCalculateSyncState();
        this.next = !(this.in1.enabled() && this.in2.enabled());

        return Promise.resolve();
    }

    public async propagateState(): Promise<void> {
        await this.onPropagateSyncState();
    }
}

export class OrGate extends BinaryGate {
    public readonly gateType: GateType = "or";

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);

        gateData["gate"] = "Or";
        gateData["color"] = "color-or";
    }

    public async onCalculateState(): Promise<void> {
        this.onCalculateSyncState();
        this.next = this.in1.enabled() || this.in2.enabled();

        return Promise.resolve();
    }

    public async propagateState(): Promise<void> {
        await this.onPropagateSyncState();
    }
}

export class NOrGate extends BinaryGate {
    public readonly gateType: GateType = "nor";

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);

        gateData["gate"] = "Nor";
        gateData["color"] = "color-nor";
    }

    public async onCalculateState(): Promise<void> {
        this.onCalculateSyncState();
        this.next = !(this.in1.enabled() || this.in2.enabled());

        return Promise.resolve();
    }

    public async propagateState(): Promise<void> {
        await this.onPropagateSyncState();
    }
}

export class XorGate extends BinaryGate {
    public readonly gateType: GateType = "xor";

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);

        gateData["gate"] = "Xor";
        gateData["color"] = "color-xor";
    }

    public async onCalculateState(): Promise<void> {
        this.onCalculateSyncState();
        this.next = this.in1.enabled() !== this.in2.enabled();

        return Promise.resolve();
    }

    public async propagateState(): Promise<void> {
        await this.onPropagateSyncState();
    }
}

export class XNorGate extends BinaryGate {
    public readonly gateType: GateType = "xnor";

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);

        gateData["gate"] = "Xnor";
        gateData["color"] = "color-xnor";
    }

    public async onCalculateState(): Promise<void> {
        this.onCalculateSyncState();
        this.next = this.in1.enabled() == this.in2.enabled();

        return Promise.resolve();
    }

    public async propagateState(): Promise<void> {
        await this.onPropagateSyncState();
    }
}

export class PowerGate extends OutputGate {
    public readonly gateType: GateType = "power";

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);

        gateData["icon"] = faPowerOff;
        gateData["color"] = "color-power";
    }

    public async onCalculateState(): Promise<void> {
        this.onCalculateSyncState();
        this.next = !this.state;

        return Promise.resolve();
    }

    public async propagateState(): Promise<void> {
        if(this.state == this.next)
            return;

        LoopGuard.instance.resetCycle();
        this.state = this.next;

        if(this.state)
            await this.out.enable();
        else
            await this.out.disable();

        this.gateData["out-1"] = this.out.enabled();
        this.syncGateData();
    }
}

export class BulbGate extends InputGate {
    public readonly gateType: GateType = "bulb";

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);

        gateData["icon"] = faLightbulb;
        gateData["color"] = "color-power";
    }

    public async onCalculateState(): Promise<void> {
        this.onCalculateSyncState();
        return Promise.resolve();
    }

    public propagateState(): Promise<void> {
        return Promise.resolve();
    }
}

export class ClockGate extends OutputGate {
    private enabled: boolean = false;

    public readonly gateType: GateType = "clock";

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);

        gateData["icon"] = faClock;
        gateData["color"] = "color-clock";

        registerClock(this);
    }

    public async onCalculateState(): Promise<void> {
        this.onCalculateSyncState();
        this.next = !this.next;

        return Promise.resolve();
    }

    public async propagateState(): Promise<void> {
        if(this.enabled)
            await this.onPropagateSyncState();
    }

    public async toggleClock(): Promise<void> {
        if(this.enabled) {
            this.next = false;
            this.enabled = false;
        } else {
            this.next = masterState();
            this.enabled = true;
        }
    }
}

export class SevenSegmentDisplay extends Gate {
    public readonly gateType: GateType = "display";

    private readonly in1 = new InHandle("in-1", this);
    private readonly in2 = new InHandle("in-2", this);
    private readonly in3 = new InHandle("in-3", this);
    private readonly in4 = new InHandle("in-4", this);
    private readonly in5 = new InHandle("in-5", this);

    constructor(id: string, gateData: GateData, private readonly onUpdateFunction: UpdateGateSignature) {
        super(id, gateData);
    }

    protected onSyncGateData(): void {
        this.onUpdateFunction(this.id, this.gateData);
    }

    public async resetState(): Promise<void> {
        await this.in1.reset();
        await this.in2.reset();
        await this.in3.reset();
        await this.in4.reset();
        await this.in5.reset();
        this.gateData["in-1"] = false;
        this.gateData["in-2"] = false;
        this.gateData["in-3"] = false;
        this.gateData["in-4"] = false;
        this.gateData["in-5"] = false;
        this.gateData["in-1-connected"] = false;
        this.gateData["in-2-connected"] = false;
        this.gateData["in-3-connected"] = false;
        this.gateData["in-4-connected"] = false;
        this.gateData["in-5-connected"] = false;
    }

    public async onCalculateState(): Promise<void> {
        this.gateData["in-1"] = this.in1.enabled();
        this.gateData["in-2"] = this.in2.enabled();
        this.gateData["in-3"] = this.in3.enabled();
        this.gateData["in-4"] = this.in4.enabled();
        this.gateData["in-5"] = this.in5.enabled();

        this.gateData["value"] =  +this.in1.enabled() + (+this.in2.enabled() << 1) + (+this.in3.enabled() << 2) + (+this.in4.enabled() << 3);
        this.syncGateData();
        return Promise.resolve();
    }

    public propagateState(): Promise<void> {
        return Promise.resolve();
    }

    public getNode(id: string): Handle | null {
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
            default:
                return null;
        }
    }
}

export class BufferGate extends UnaryGate {
    public readonly gateType: GateType = "buffer";

    public constructor(id: string, gateData: GateData, updateFunction: UpdateGateSignature) {
        super(id, gateData, updateFunction);
    }

    public async onCalculateState(): Promise<void> {
        this.onCalculateSyncState();
        this.next = this.in.enabled();

        return Promise.resolve();
    }

    public async propagateState(): Promise<void> {
        await this.onPropagateSyncState();
    }
}

export class PrefabGate extends Gate {
    public readonly gateType: GateType;

    public readonly gates: Gate[] = [];
    public readonly handleMap = new Map<string, Handle>();
    public readonly bufferMap = new Map<string, HandleWrapper>();

    public constructor(id: string, gateData: GateData, gateType: GateType, private readonly onUpdateFunction: UpdateGateSignature) {
        super(id, gateData);
        this.gateType = gateType;
    }

    protected onSyncGateData(): void {
        this.onUpdateFunction(this.id, this.gateData);
    }

    protected onCalculateState(): Promise<void> {
        this.syncGateData();
        return Promise.resolve();
    }

    protected propagateState(): Promise<void> {
        return Promise.resolve();
    }

    public async resetState(): Promise<void> {
        for(const gate of this.gates)
            await deleteGate(new CoreGateData(gate.id, gate.gateType));

        this.bufferMap.clear();
        this.gates.splice(0, this.gates.length);
    }

    public getNode(handleId: string): Handle | null {
        return this.handleMap.get(handleId) ?? null;
    }

    public syncGateHandle(bufferId: string, gateData: GateData) : void {
        const wrapper = this.bufferMap.get(bufferId);
        if(!wrapper)
            return;

        const handleId = wrapper.handleId;
        switch (wrapper.gateType) {
            case "clock":
            case "power": {
                    this.gateData[handleId] = gateData["in-1"];
                    this.gateData["connections"][handleId] = gateData["connections"]["in-1"];
                }
                break;
            case "bulb":
            case "display":
                this.gateData[handleId] = gateData["out-1"];
                break;
        }


        this.syncGateData();
    }
}