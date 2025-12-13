import { faClock, faLightbulb, faPowerOff } from "@fortawesome/free-solid-svg-icons";

import { type GateNodeType } from "$lib/flow";

import { Pin, InputPin } from "$lib/core/pin";
import type { GateType, UpdateGateSignature } from "$lib/core/types";
import { LoopGuard, masterState, registerClock } from "$lib/core/cycles";
import type { PrefabGateData, SevenSegmentGateData } from "$lib/core/types/gate-data";
import { BaseGate, BinaryGate, InputGate, OutputGate, UnaryGate } from "$lib/core/gates/gate";
import {MasterGatePool} from "$lib";

export class NotGate extends UnaryGate {
    public readonly gateType: GateType = "not";

    public constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, onUpdateFunction);
        this.gateData.type = this.gateType;
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

    public constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, onUpdateFunction);
        this.gateData.type = this.gateType;
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

export class NandGate extends BinaryGate {
    public readonly gateType: GateType = "nand";

    public constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, onUpdateFunction);
        this.gateData.type = this.gateType;
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

    public constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, onUpdateFunction);
        this.gateData.type = this.gateType;
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

export class NorGate extends BinaryGate {
    public readonly gateType: GateType = "nor";

    public constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, onUpdateFunction);
        this.gateData.type = this.gateType;
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

    public constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, onUpdateFunction);
        this.gateData.type = this.gateType;
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

    public constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, onUpdateFunction);
        this.gateData.type = this.gateType;
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

    public constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, onUpdateFunction);
        this.gateData.icon = faPowerOff;
        this.gateData.type = this.gateType;
        this.gateData.toggle = () => this.calculateState();
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

        this.gateData.out1 = this.out.enabled();
        this.syncGateData();
    }
}

export class ProbeGate extends InputGate {
    public readonly gateType: GateType = "probe";

    public constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, onUpdateFunction);
        this.gateData.icon = faLightbulb;
        this.gateData.type = this.gateType;
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

    public constructor(id: string, onUpdateFunction: UpdateGateSignature) {
        super(id, onUpdateFunction);
        this.gateData.icon = faClock;
        this.gateData.type = this.gateType;
        this.gateData.toggle = () => this.toggleClock();

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
            await this.onPropagateSyncState();
        } else {
            this.next = masterState();
            this.enabled = true;
        }
    }
}

export class SevenSegmentDisplay extends BaseGate<SevenSegmentGateData> {
    public readonly gateType: GateType = "display";
    public readonly nodeType: GateNodeType = "display";

    private readonly in1 = new InputPin("in-1", this);
    private readonly in2 = new InputPin("in-2", this);
    private readonly in3 = new InputPin("in-3", this);
    private readonly in4 = new InputPin("in-4", this);
    private readonly in5 = new InputPin("in-5", this);

    constructor(id: string, private readonly onUpdateFunction: UpdateGateSignature) {
        super(id, {
            name: "",
            type: "",
            icon: undefined,

            in1: false,
            in2: false,
            in3: false,
            in4: false,
            in5: false,

            value: 0
        });
        this.gateData.type = this.gateType;
    }

    protected onSyncGateData(): void {
        this.onUpdateFunction(this.id, this.gateData);
    }

    protected async onResetState(): Promise<void> {
        await this.in1.reset();
        await this.in2.reset();
        await this.in3.reset();
        await this.in4.reset();
        await this.in5.reset();
        this.gateData.in1 = false;
        this.gateData.in2 = false;
        this.gateData.in3 = false;
        this.gateData.in4 = false;
        this.gateData.in5 = false;
    }

    public async onCalculateState(): Promise<void> {
        this.gateData.in1 = this.in1.enabled();
        this.gateData.in2 = this.in2.enabled();
        this.gateData.in3 = this.in3.enabled();
        this.gateData.in4 = this.in4.enabled();
        this.gateData.in5 = this.in5.enabled();

        this.gateData["value"] =  +this.in1.enabled() + (+this.in2.enabled() << 1) + (+this.in3.enabled() << 2) + (+this.in4.enabled() << 3);

        this.syncGateData();
        return Promise.resolve();
    }

    public propagateState(): Promise<void> {
        return Promise.resolve();
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
            default:
                return null;
        }
    }
}

export class BufferGate extends UnaryGate {
    public readonly gateType: GateType = "buffer";

    public constructor(id: string, updateFunction: UpdateGateSignature) {
        super(id, updateFunction);
        this.gateData.type = this.gateType;
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

export class PrefabGate extends BaseGate<PrefabGateData> {
    public readonly gateType: GateType;
    public readonly nodeType: GateNodeType = "prefab";

    public constructor(id: string, gateType: GateType, private readonly onUpdateFunction: UpdateGateSignature) {
        super(id, {
            name: "",
            type: "",
            icon: undefined,

            powerCount: 0,
            probeCount: 0,
            clockCount: 0,
            displayCount: 0,

            expanded: false,
            bufferPinMap: new Map<string, string>(),
            bufferTypeMap: new Map<string, "power" | "clock" | "probe" | "display">()
        });
        this.gateType = this.gateData.type = gateType;
    }

    protected onSyncGateData() : void {
        this.onUpdateFunction(this.id, this.gateData);
    }

    protected onCalculateState() : Promise<void> {
        this.syncGateData();
        return Promise.resolve();
    }

    protected propagateState() : Promise<void> {
        return Promise.resolve();
    }

    protected async onResetState() : Promise<void> {
        this.gateData.expanded = false;

        this.gateData.bufferPinMap.clear();
        this.gateData.bufferTypeMap.clear();

        this.gateData.powerCount = this.gateData.probeCount = this.gateData.clockCount = this.gateData.displayCount = 0;
    }

    public getPin(pinId: string) : Pin | null {
        for(const pair of this.gateData.bufferPinMap) {
            if(pinId == pair[1]) {
                const gate = MasterGatePool.instance.getGate(pair[0]);
                const gateType = this.gateData.bufferTypeMap.get(pair[0]);

                if(!gateType || !gate)
                    return null;

                console.log(pinId);
                switch (gateType) {
                    case "power":
                    case "clock":
                        return gate.getPin("in-1");
                    case "probe":
                    case "display":
                        return gate.getPin("out-1");
                    default:
                        return null;
                }
            }
        }

        return null;
    }
}