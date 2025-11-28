import {type CreateGateSignature, type GateNodeType, type UpdateGateSignature} from "$lib/circuit";
import { Gate, AndGate, BulbGate, NAndGate, NOrGate, NotGate, OrGate, XNorGate, XorGate, ClockGate, PowerGate, BufferGate, SevenSegmentDisplay, type GateType } from "$lib/logic";

import { createGameData } from "$lib/pools/utils";

const allGates = new Map<string, Gate>();

export function getGate(id: string) : Gate | undefined {
    return allGates.get(id);
}

abstract class GatePool {
    protected readonly gates: Gate[] = [];
    protected readonly gatePool: Gate[] = [];

    protected abstract readonly type: GateType;
    protected abstract readonly nodeType: GateNodeType;

    protected constructor(protected readonly createFunction: CreateGateSignature, protected readonly updateFunction: UpdateGateSignature) { }

    protected abstract initGate() : Gate;

    public createGate(render: boolean) : Gate {
        if(this.gatePool.length > 0) {
            const gate = this.gatePool.pop();

            if(gate) {
                this.gates.push(gate);
                if(render)
                    this.createFunction(this.nodeType, gate);

                return gate;
            }
        }

        const gate = this.initGate();
        allGates.set(gate.id, gate);
        this.gates.push(gate);

        if(render)
            this.createFunction(this.nodeType, gate);

        return gate;
    }

    public deleteGate(id: string) : void {
        const count = this.gates.length;
        for(let i = 0; i <= count; i++)
        {
            if(this.gates[i].id == id) {
                const gate = this.gates[i];
                gate.reset().then(() => {
                    this.gates.splice(i, 1);
                    this.gatePool.push(gate);
                });
                break;
            }
        }
    }
}

export class NotGatePool extends GatePool {
    public static instance: NotGatePool;
    protected readonly type: GateType = "not";
    protected readonly nodeType: GateNodeType = "unary";

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) : void {
        NotGatePool.instance = new NotGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = createGameData(this.type, 1, 1);
        return new NotGate(allGates.size.toString(), data, this.updateFunction);
    }
}

export class OrGatePool extends GatePool {
    public static instance: OrGatePool;
    protected readonly type: GateType = "or";
    protected readonly nodeType: GateNodeType = "binary";

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) : void {
        OrGatePool.instance = new OrGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = createGameData(this.type, 2, 1);
        return new OrGate(allGates.size.toString(), data, this.updateFunction);
    }
}

export class NOrGatePool extends GatePool {
    public static instance: NOrGatePool;
    protected readonly type: GateType = "nor"
    protected readonly nodeType: GateNodeType = "binary";

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) : void {
        NOrGatePool.instance = new NOrGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = createGameData(this.type, 2, 1);
        return new NOrGate(allGates.size.toString(), data, this.updateFunction);
    }
}

export class AndGatePool extends GatePool {
    public static instance: AndGatePool;
    protected readonly type: GateType = "and";
    protected readonly nodeType: GateNodeType = "binary";

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) : void {
        AndGatePool.instance = new AndGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = createGameData(this.type, 2, 1);
        return new AndGate(allGates.size.toString(), data, this.updateFunction);
    }
}

export class NAndGatePool extends GatePool {
    public static instance: NAndGatePool;
    protected readonly type: GateType = "nand";
    protected readonly nodeType: GateNodeType = "binary";

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) : void {
        NAndGatePool.instance = new NAndGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = createGameData(this.type, 2, 1);
        return new NAndGate(allGates.size.toString(), data, this.updateFunction);
    }
}

export class XorGatePool extends GatePool {
    public static instance: XorGatePool;
    protected readonly type: GateType = "xor";
    protected readonly nodeType: GateNodeType = "binary";

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) : void {
        XorGatePool.instance = new XorGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = createGameData(this.type, 2, 1);
        return new XorGate(allGates.size.toString(), data, this.updateFunction);
    }
}

export class XNorGatePool extends GatePool {
    public static instance: XNorGatePool;
    protected readonly type: GateType = "nor";
    protected readonly nodeType: GateNodeType = "binary";

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) : void {
        XNorGatePool.instance = new XNorGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = createGameData(this.type, 2, 1);
        return new XNorGate(allGates.size.toString(), data, this.updateFunction);
    }
}

export class BulbGatePool extends GatePool {
    public static instance: BulbGatePool;
    protected readonly type: GateType = "bulb";
    protected readonly nodeType: GateNodeType = "s-input";

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) : void {
        BulbGatePool.instance = new BulbGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = createGameData(this.type, 1, 0);
        return new BulbGate(allGates.size.toString(), data, this.updateFunction);
    }
}

export class ClockGatePool extends GatePool {
    public static instance: ClockGatePool;
    protected readonly type: GateType = "clock";
    protected readonly nodeType: GateNodeType = "s-output";

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) : void {
        ClockGatePool.instance = new ClockGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = createGameData(this.type, 0, 1);

        const id = allGates.size.toString();
        const gate = new ClockGate(id, data, this.updateFunction);
        data["toggle"] = () => gate.enable();
        return gate;
    }
}

export class PowerGatePool extends GatePool {
    public static instance: PowerGatePool;
    protected readonly type: GateType = "power";
    protected readonly nodeType: GateNodeType = "s-output";

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) : void {
        PowerGatePool.instance = new PowerGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = createGameData(this.type, 0, 1);

        const id = allGates.size.toString();
        const gate = new PowerGate(id, data, this.updateFunction);
        data["toggle"] = () => gate.enable();
        return gate;
    }
}

export class SevenSegmentPool extends GatePool {
    public static instance: SevenSegmentPool;
    protected readonly type: GateType = "display";
    protected readonly nodeType: GateNodeType = "display";
    
    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) {
        this.instance = new SevenSegmentPool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate() : Gate {
        const data = createGameData(this.type, 5, 0);
        data["value"] = 0;

        const id = allGates.size.toString();
        return new SevenSegmentDisplay(id, data, this.updateFunction);
    }
}

export class BufferGatePool extends GatePool {
    public static instance: BufferGatePool;
    protected readonly type: GateType = "buffer";
    protected readonly nodeType: GateNodeType = "unary";

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) {
        this.instance = new BufferGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate() : Gate {
        const data = createGameData(this.type, 1, 0);
        return new BufferGate(allGates.size.toString(), data, this.updateFunction);
    }
}
 