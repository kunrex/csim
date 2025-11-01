import { Gate } from "$lib/logic/gate";
import { InNode, OutNode } from "$lib/logic/node";
import type {IEnable} from "$lib/logic/interfaces/i-enable";
import type {GateData} from "$lib/types";

export class AndGate extends Gate {
    public readonly in1: InNode = new InNode("in-1", this);
    public readonly in2: InNode = new InNode("in-2", this);

    public readonly out: OutNode = new OutNode("out-1");

    public constructor(id: string, gateData: GateData) {
        super(id, gateData);
    }

    public enable(): void {
        const prev = this.state;
        this.state = this.in2.enabled() && this.in1.enabled();
        this.gateData["in-1"] = this.in1.enabled();
        this.gateData["in-2"] = this.in2.enabled();

        if(this.state == prev)
            return;

        if(this.state)
            this.out.enable();
        else
            this.out.disable();

        this.gateData["out-1"] = this.out.enabled();
    }

    public getNode(id: string): IEnable | null {
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

export class OrGate extends Gate {
    public readonly in1: InNode = new InNode("in-1", this);
    public readonly in2: InNode = new InNode("in-2", this);

    public readonly out: OutNode = new OutNode("out-1");

    public constructor(id: string, gateData: GateData) {
        super(id, gateData);
    }

    public enable(): void {
        const prev = this.state;
        this.state = this.in2.enabled() || this.in1.enabled();
        this.gateData["in-1"] = this.in1.enabled();
        this.gateData["in-2"] = this.in2.enabled();

        if(this.state == prev)
            return;

        if(this.state)
            this.out.enable();
        else
            this.out.disable();

        this.gateData["out-1"] = this.out.enabled();
    }

    public getNode(id: string): IEnable | null {
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

export class NandGate extends Gate {
    public readonly in1: InNode = new InNode("in-1", this);
    public readonly in2: InNode = new InNode("in-2", this);

    public readonly out: OutNode = new OutNode("out-1");

    public constructor(id: string, gateData: GateData) {
        super(id, gateData);
    }

    public enable(): void {
        const prev = this.state;
        this.state = !(this.in2.enabled() && this.in1.enabled());
        this.gateData["in-1"] = this.in1.enabled();
        this.gateData["in-2"] = this.in2.enabled();

        if(this.state == prev)
            return;

        if(this.state)
            this.out.enable();
        else
            this.out.disable();

        this.gateData["out-1"] = this.out.enabled();
    }

    public getNode(id: string): IEnable | null {
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

export class NorGate extends Gate {
    public readonly in1: InNode = new InNode("in-1", this);
    public readonly in2: InNode = new InNode("in-2", this);

    public readonly out: OutNode = new OutNode("out-1");

    public constructor(id: string, gateData: GateData) {
        super(id, gateData);
    }

    public enable(): void {
        const prev = this.state;
        this.state = !(this.in2.enabled() || this.in1.enabled());
        this.gateData["in-1"] = this.in1.enabled();
        this.gateData["in-2"] = this.in2.enabled();

        if(this.state == prev)
            return;

        if(this.state)
            this.out.enable();
        else
            this.out.disable();

        this.gateData["out-1"] = this.out.enabled();
    }

    public getNode(id: string): IEnable | null {
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

export class XorGate extends Gate {
    public readonly in1: InNode = new InNode("in-1", this);
    public readonly in2: InNode = new InNode("in-2", this);

    public readonly out: OutNode = new OutNode("out-1");

    public constructor(id: string, gateData: GateData) {
        super(id, gateData);
    }

    public enable(): void {
        const prev = this.state;
        this.state = (this.in2.enabled() && !this.in1.enabled()) || (!this.in2.enabled() && this.in1.enabled());
        this.gateData["in-1"] = this.in1.enabled();
        this.gateData["in-2"] = this.in2.enabled();

        if(this.state == prev)
            return;

        if(this.state)
            this.out.enable();
        else
            this.out.disable();

        this.gateData["out-1"] = this.out.enabled();
    }

    public getNode(id: string): IEnable | null {
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

export class XnorGate extends Gate {
    public readonly in1: InNode = new InNode("in-1", this);
    public readonly in2: InNode = new InNode("in-2", this);

    public readonly out: OutNode = new OutNode("out-1");

    public constructor(id: string, gateData: GateData) {
        super(id, gateData);
    }

    public enable(): void {
        const prev = this.state;
        this.state = this.in1.enabled() == this.in2.enabled();
        this.gateData["in-1"] = this.in1.enabled();
        this.gateData["in-2"] = this.in2.enabled();

        if(this.state == prev)
            return;

        if(this.state)
            this.out.enable();
        else
            this.out.disable();

        this.gateData["out-1"] = this.out.enabled();
    }

    public getNode(id: string): IEnable | null {
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

export class NotGate extends Gate {
    public readonly in: InNode = new InNode("in-1", this);

    public readonly out: OutNode = new OutNode("out-1");

    public constructor(id: string, gateData: GateData) {
        super(id, gateData);
    }

    public enable(): void {
        const prev = this.state;
        this.state = !this.in.enabled();
        this.gateData["in-1"] = this.in.enabled();

        if(this.state == prev)
            return;

        if(this.state)
            this.out.disable();
        else
            this.out.enable();

        this.gateData["out-1"] = this.out.enabled();
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
