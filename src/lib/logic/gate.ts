import type { GateData, onUpdateSignature } from "$lib/types";
import type { IEnable } from "$lib/logic/interfaces/i-enable";
import {InNode, OutNode} from "$lib/logic/node";

export abstract class Gate implements IEnable {
    protected state: boolean = false;

    protected constructor(public readonly id: string, protected readonly gateData: GateData, protected readonly onUpdateFunction: onUpdateSignature) { }

    protected syncGameData() : void {
        this.onUpdateFunction(this.id, (node: any) => ({
            ...node,
            data: this.gateData
        }));
    }

    public enabled(): boolean {
        return this.state;
    }

    public disable(): Promise<void> { return Promise.resolve(); }
    public abstract enable(): Promise<void>;

    public abstract getNode(id: string) : IEnable | null;
}

export abstract class BinaryGate extends Gate {
    public readonly in1: InNode = new InNode("in-1", this);
    public readonly in2: InNode = new InNode("in-2", this);

    public readonly out: OutNode = new OutNode("out-1");

    protected constructor(id: string, gateData: GateData, onUpdateFUnction: onUpdateSignature) {
        super(id, gateData, onUpdateFUnction);
    }

    protected async check(prev: boolean) : Promise<void> {
        this.gateData["in-1"] = this.in1.enabled();
        this.gateData["in-2"] = this.in2.enabled();

        if(this.state == prev)
            return

        if(this.state)
            await this.out.enable();
        else
            await this.out.disable();

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