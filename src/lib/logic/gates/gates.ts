import { type GateNodeType, type UpdateGateSignature } from "$lib/circuit";

import { deleteGate } from "$lib/pools";

import type { GateData, GateType } from "$lib/logic/types";

import { MasterClock } from "$lib/logic/clock";
import { BinaryGate, Gate } from "$lib/logic/gates/gate";
import { Handle, InHandle, OutHandle } from "$lib/logic/handle";
import { faClock, faLightbulb, faPowerOff } from "@fortawesome/free-solid-svg-icons";

export class AndGate extends BinaryGate {
    public gateType(): GateType { return "and"; }

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);
        gateData["gate"] = "And";
        gateData["color"] = "color-and";
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = this.in2.enabled() && this.in1.enabled();
        await this.check(prev);
    }
}

export class OrGate extends BinaryGate {
    public gateType(): GateType { return "or"; }

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);
        gateData["gate"] = "Or";
        gateData["color"] = "color-or";
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = this.in2.enabled() || this.in1.enabled();
        await this.check(prev);
    }
}

export class NAndGate extends BinaryGate {
    public gateType(): GateType { return "nand"; }

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);
        gateData["gate"] = "Nand";
        gateData["color"] = "color-nand";
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = !(this.in2.enabled() && this.in1.enabled());
        await this.check(prev);
    }
}

export class NOrGate extends BinaryGate {
    public gateType(): GateType { return "nor"; }

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);
        gateData["gate"] = "Nor";
        gateData["color"] = "color-nor";
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = !(this.in2.enabled() || this.in1.enabled());
        await this.check(prev);
    }
}

export class XorGate extends BinaryGate {
    public gateType(): GateType { return "xor"; }

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);
        gateData["gate"] = "Xor";
        gateData["color"] = "color-xor";
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = (this.in2.enabled() && !this.in1.enabled()) || (!this.in2.enabled() && this.in1.enabled());
        await this.check(prev);
    }
}

export class XNorGate extends BinaryGate {
    public gateType(): GateType { return "xnor"; }

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);
        gateData["gate"] = "Xnor";
        gateData["color"] = "color-xnor";
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = this.in1.enabled() == this.in2.enabled();
        await this.check(prev);
    }
}

export class NotGate extends Gate {
    private state: boolean = false;

    public gateType(): GateType { return "not"; }

    public readonly in: InHandle = new InHandle("in-1", this);

    public readonly out: OutHandle = new OutHandle("out-1");

    public enabled() : boolean { return this.state; }

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);
        gateData["gate"] = "Not";
        gateData["color"] = "color-not";
    }

    public async reset(): Promise<void> {
        await this.in.reset();
        this.gateData["in-1-connected"] = false;

        await this.out.reset();
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = !this.in.enabled();
        this.gateData["in-1"] = this.in.enabled();
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

    public getNode(id: string): Handle | null {
        switch (id) {
            case this.in.id:
                return this.in;
            case this.out.id:
                return this.out;
            default:
                return null;
        }
    }
}

export class PowerGate extends Gate {
    private state: boolean = false;

    public gateType(): GateType { return "power"; }

    public readonly out: OutHandle = new OutHandle("out-1");

    public enabled(): boolean { return this.state; }

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);
        gateData["icon"] = faPowerOff;
        gateData["color"] = "color-power";
    }

    public async enable(): Promise<void> {
        this.state = !this.state;
        if(this.state)
            await this.out.enable();
        else
            await this.out.disable();

        this.gateData["out-1"] = this.state;
        this.syncGateData();
    }

    public async reset(): Promise<void> {
        await this.out.reset();
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

export class BulbGate extends Gate {
    private state: boolean = false;

    public gateType(): GateType { return "bulb"; }

    public readonly in: InHandle = new InHandle("in-1", this);

    public enabled(): boolean { return this.state; }

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);
        gateData["icon"] = faLightbulb;
        gateData["color"] = "color-bulb";
    }

    public enable(): Promise<void> {
        this.gateData["in-1"] = this.in.enabled();
        this.syncGateData();
        return Promise.resolve();
    }

    public async reset(): Promise<void> {
        await this.in.reset();
        this.gateData["in-1"] = false;
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

export class ClockGate extends Gate {
    private state: boolean = false;

    public gateType(): GateType { return "clock"; }

    public readonly out: OutHandle = new OutHandle("out-1");

    public enabled(): boolean { return this.state; }

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);
        gateData["icon"] = faClock;
        gateData["color"] = "color-clock";
        MasterClock.instance.registerClock(this);
    }

    public async enable(): Promise<void> {
        this.state = !this.state;
    }

    public async reset(): Promise<void> {
        await this.out.reset();
    }

    public getNode(id: string): Handle | null {
        switch (id) {
            case this.out.id:
                return this.out;
            default:
                return null;
        }
    }

    public async clockPulse(state: boolean) : Promise<void> {
        if(this.state) {
            if (state)
                await this.out.enable();
            else
                await this.out.disable();

            this.gateData["out-1"] = this.state;
            this.syncGateData();
        }
    }
}

export class BufferGate extends Gate {
    private state: boolean = false;

    public gateType(): GateType { return "buffer"; }

    public readonly in: InHandle = new InHandle("in-1", this);

    public readonly out: OutHandle = new OutHandle("out-1");

    public enabled(): boolean { return this.state }

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);
        gateData["gate"] = "Buffer";
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = this.in.enabled();
        this.gateData["in-1"] = this.state;

        this.syncGateData();

        if(this.state == prev)
            return;

        if(this.state)
            await this.out.enable();
        else
            await this.out.disable();

        this.gateData["out-1"] = this.state;
        this.syncGateData();
    }

    public async reset(): Promise<void> {
        await this.in.reset();
        this.gateData["in-1-connected"] = false;

        await this.out.reset();
    }

    public getNode(id: string): Handle | null {
        switch (id) {
            case this.in.id:
                return this.in;
            case this.out.id:
                return this.out;
            default:
                return null;
        }
    }
}

export class SevenSegmentDisplay extends Gate {
    public gateType(): GateType { return "display"; }

    private readonly in1 = new InHandle("in-1", this);
    private readonly in2 = new InHandle("in-2", this);
    private readonly in3 = new InHandle("in-3", this);
    private readonly in4 = new InHandle("in-4", this);
    private readonly in5 = new InHandle("in-5", this);

    public enabled(): boolean { return true; }

    constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public enable(): Promise<void> {
        this.gateData["in-1"] = this.in1.enabled();
        this.gateData["in-2"] = this.in2.enabled();
        this.gateData["in-3"] = this.in3.enabled();
        this.gateData["in-4"] = this.in4.enabled();
        this.gateData["in-5"] = this.in5.enabled();

        this.gateData["value"] =  +this.in1.enabled() + (+this.in2.enabled() << 1) + (+this.in3.enabled() << 2) + (+this.in4.enabled() << 3);
        this.syncGateData();
        return Promise.resolve();
    }

    public async reset(): Promise<void> {
        await this.in1.reset();
        await this.in2.reset();
        await this.in3.reset();
        await this.in4.reset();
        await this.in5.reset();
        this.syncGateData();
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

export class PrefabGate extends Gate {
    public gateType(): GateNodeType { return "prefab" }

    public readonly gates: Gate[] = [];
    public readonly handles: Map<string, Handle | undefined> = new Map<string, Handle | undefined>();

    public enabled(): boolean { return false; }
    
    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateGateSignature) {
        super(id, gateData, onUpdateFunction);
    }
    
    public enable(): Promise<void> {
        return Promise.resolve();
    }

    public async reset(): Promise<void> {
        const count = this.gates.length;
        for(let i = 0; i < count; i++) {
            const gate = this.gates[i];
            deleteGate({
                id: gate.id,
                type: gate.gateType()
            });
        }

        this.gates.splice(0, this.gates.length);
        this.handles.clear();
    }

    public getNode(id: string): Handle | null {
        const handle = this.handles.get(id);
        return handle ?? null;
    }

    public updateGateData(id: string, gateData: GateData): void {
        this.gateData.set(id, gateData);
    }
}