import {BinaryGate, Gate} from "$lib/logic/gate";
import { InNode, OutNode } from "$lib/logic/node";
import type {IEnable} from "$lib/logic/interfaces/i-enable";
import type {GateData, onUpdateSignature} from "$lib/types";

export class AndGate extends BinaryGate {
    public constructor(id: string, gateData: GateData, onUpdateFunction: onUpdateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = this.in2.enabled() && this.in1.enabled();
        await this.check(prev);
        this.syncGameData();
    }
}

export class OrGate extends BinaryGate {
    public constructor(id: string, gateData: GateData, onUpdateFunction: onUpdateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = this.in2.enabled() || this.in1.enabled();
        await this.check(prev);
        this.syncGameData();
    }
}

export class NandGate extends BinaryGate {
    public constructor(id: string, gateData: GateData, onUpdateFunction: onUpdateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = !(this.in2.enabled() && this.in1.enabled());
        await this.check(prev);
        this.syncGameData();
    }
}

export class NorGate extends BinaryGate {
    public constructor(id: string, gateData: GateData, onUpdateFunction: onUpdateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = !(this.in2.enabled() || this.in1.enabled());
        await this.check(prev);
        this.syncGameData();
    }
}

export class XorGate extends BinaryGate {
    public constructor(id: string, gateData: GateData, onUpdateFunction: onUpdateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = (this.in2.enabled() && !this.in1.enabled()) || (!this.in2.enabled() && this.in1.enabled());
        await this.check(prev);
        this.syncGameData();
    }
}

export class XnorGate extends BinaryGate {
    public constructor(id: string, gateData: GateData, onUpdateFunction: onUpdateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = this.in1.enabled() == this.in2.enabled();
        await this.check(prev);
        this.syncGameData();
    }
}

export class NotGate extends Gate {
    public readonly in: InNode = new InNode("in-1", this);

    public readonly out: OutNode = new OutNode("out-1");

    public constructor(id: string, gateData: GateData, onUpdateFunction: onUpdateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = !this.in.enabled();
        this.gateData["in-1"] = this.in.enabled();

        if(this.state == prev)
            return;

        if(this.state)
            await this.out.disable();
        else
            await this.out.enable();

        this.gateData["out-1"] = this.out.enabled();
        this.syncGameData();
    }

    public getNode(id: string): IEnable | null {
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
    public readonly out: OutNode = new OutNode("out-1");

    public constructor(id: string, gateData: GateData, onUpdateFunction: onUpdateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public async enable(): Promise<void> {
        this.state = !this.state;
        if(this.state)
            await this.out.enable();
        else
            await this.out.disable();

        this.gateData["out-1"] = this.state;
        this.syncGameData();
    }

    public getNode(id: string): IEnable | null {
        switch (id) {
            case this.out.id:
                return this.out;
            default:
                return null;
        }
    }
}

export class BulbGate extends Gate {
    public readonly in: InNode = new InNode("in-1", this);

    public constructor(id: string, gateData: GateData, onUpdateFunction: onUpdateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public enable(): Promise<void> {
        this.gateData["in-1"] = this.in.enabled();
        this.syncGameData();
        return Promise.resolve();
    }

    public getNode(id: string): IEnable | null {
        switch (id) {
            case this.in.id:
                return this.in;
            default:
                return null;
        }
    }
}
