import { Gate } from "$lib/structure/gate";
import { InNode, OutNode } from "$lib/structure/node";

export class AndGate extends Gate {
    public readonly in1: InNode = new InNode(this);
    public readonly in2: InNode = new InNode(this);

    public readonly out: OutNode = new OutNode();

    public constructor() {
        super();
    }

    public enable(): void {
        const prev = this.state;
        this.state = this.in2.enabled() && this.in1.enabled();

        if(this.state == prev)
            return;

        if(this.state)
            this.out.enable();
        else
            this.out.disable();
    }
}

export class OrGate extends Gate {
    public readonly in1: InNode = new InNode(this);
    public readonly in2: InNode = new InNode(this);

    public readonly out: OutNode = new OutNode();

    public constructor() {
        super();
    }

    public enable(): void {
        const prev = this.state;
        this.state = this.in2.enabled() && this.in1.enabled();

        if(this.state == prev)
            return;

        if(this.state)
            this.out.enable();
        else
            this.out.disable();
    }
}

export class NandGate extends Gate {
    public readonly in1: InNode = new InNode(this);
    public readonly in2: InNode = new InNode(this);

    public readonly out: OutNode = new OutNode();

    public constructor() {
        super();
    }

    public enable(): void {
        const prev = this.state;
        this.state = this.in2.enabled() && this.in1.enabled();

        if(this.state == prev)
            return;

        if(this.state)
            this.out.enable();
        else
            this.out.disable();
    }
}

export class NorGate extends Gate {
    public readonly in1: InNode = new InNode(this);
    public readonly in2: InNode = new InNode(this);

    public readonly out: OutNode = new OutNode();

    public constructor() {
        super();
    }


    public enable(): void {
        const prev = this.state;
        this.state = this.in2.enabled() && this.in1.enabled();

        if(this.state == prev)
            return;

        if(this.state)
            this.out.enable();
        else
            this.out.disable();
    }
}

export class XorGate extends Gate {
    public readonly in1: InNode = new InNode(this);
    public readonly in2: InNode = new InNode(this);

    public readonly out: OutNode = new OutNode();

    public constructor() {
        super();
    }

    public enable(): void {
        const prev = this.state;
        this.state = this.in2.enabled() && this.in1.enabled();

        if(this.state == prev)
            return;

        if(this.state)
            this.out.enable();
        else
            this.out.disable();
    }
}

export class XnorGate extends Gate {
    public readonly in1: InNode = new InNode(this);
    public readonly in2: InNode = new InNode(this);

    public readonly out: OutNode = new OutNode();

    public constructor() {
        super();
    }

    public enable(): void {
        const prev = this.state;
        this.state = this.in2.enabled() && this.in1.enabled();

        if(this.state == prev)
            return;

        if(this.state)
            this.out.enable();
        else
            this.out.disable();
    }
}

export class NotGate extends Gate {
    public readonly in: InNode = new InNode(this);

    public readonly out: OutNode = new OutNode();

    public constructor() {
        super();
    }

    public enable(): void {
        const prev = this.state;
        this.state = this.in.enabled();

        if(this.state == prev)
            return;

        if(this.state)
            this.out.enable();
        else
            this.out.disable();
    }
}
