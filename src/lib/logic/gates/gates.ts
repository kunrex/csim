import { BinaryGate, Gate } from "$lib/logic/gates/gate";
import { Handle, InHandle, OutHandle } from "$lib/logic/handle";
import type { GateData, UpdateSignature } from "$lib/circuit";

export class AndGate extends BinaryGate {
    public inCount() : number { return 2; };
    public outCount(): number { return 1; };

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = this.in2.enabled() && this.in1.enabled();
        await this.check(prev);
    }
}

export class OrGate extends BinaryGate {
    public inCount() : number { return 2; };
    public outCount(): number { return 1; };

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = this.in2.enabled() || this.in1.enabled();
        await this.check(prev);
    }
}

export class NAndGate extends BinaryGate {
    public inCount() : number { return 2; };
    public outCount(): number { return 1; };

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = !(this.in2.enabled() && this.in1.enabled());
        await this.check(prev);
    }
}

export class NOrGate extends BinaryGate {
    public inCount() : number { return 2; };
    public outCount(): number { return 1; };

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = !(this.in2.enabled() || this.in1.enabled());
        await this.check(prev);
    }
}

export class XorGate extends BinaryGate {
    public inCount() : number { return 2; };
    public outCount(): number { return 1; };

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = (this.in2.enabled() && !this.in1.enabled()) || (!this.in2.enabled() && this.in1.enabled());
        await this.check(prev);
    }
}
export class XNorGate extends BinaryGate {
    public inCount() : number { return 2; };
    public outCount(): number { return 1; };

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = this.in1.enabled() == this.in2.enabled();
        await this.check(prev);
    }
}

export class NotGate extends Gate {
    public readonly in: InHandle = new InHandle("in-1", this);

    public readonly out: OutHandle = new OutHandle("out-1");

    public inCount() : number { return 1; };
    public outCount(): number { return 1; };

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public async enable(): Promise<void> {
        const prev = this.state;
        this.state = !this.in.enabled();
        this.gateData["in-1"] = this.in.enabled();

        if(this.state == prev) {
            this.syncGameData();
            return;
        }

        if(this.state)
            await this.out.enable();
        else
            await this.out.disable();

        this.gateData["out-1"] = this.out.enabled();
        this.syncGameData();
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
    public readonly out: OutHandle = new OutHandle("out-1");

    public inCount() : number { return 0; };
    public outCount(): number { return 1; };

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateSignature) {
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
    public readonly in: InHandle = new InHandle("in-1", this);

    public inCount() : number { return 1; };
    public outCount(): number { return 0; };

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateSignature) {
        super(id, gateData, onUpdateFunction);
    }

    public enable(): Promise<void> {
        this.gateData["in-1"] = this.in.enabled();
        this.syncGameData();
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

export class ClockGate extends Gate {
    public readonly out: OutHandle = new OutHandle("out-1");

    public inCount() : number { return 0; };
    public outCount(): number { return 1; };

    public constructor(id: string, gateData: GateData, onUpdateFunction: UpdateSignature) {
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

    public getNode(id: string): Handle | null {
        switch (id) {
            case this.out.id:
                return this.out;
            default:
                return null;
        }
    }
}