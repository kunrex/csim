import { type GateData, type GateType, type UpdateSignature } from "$lib/circuit";
import { AndGate, BulbGate, Gate, NAndGate, NOrGate, NotGate, OrGate, PowerGate, XNorGate, XorGate } from "$lib/logic";

type CreateGateSignature = (type: GateType, gameData: GateData) => string;

export const allGates: Gate[] = [];

export function getGate(id: string) : Gate | null {
    for(let i = 0; i < allGates.length; i++) {
        if(allGates[i].id == id)
            return allGates[i];
    }

    return null;
}

abstract class GatePool {
    private readonly gates: Gate[] = [];
    private readonly gatePool: Gate[] = [];

    protected constructor(protected readonly createFunction: CreateGateSignature, protected readonly updateFunction: UpdateSignature) { }

    protected createGameData(inCount: number, outCount: number) : GateData {
        let data: GateData = { };

        for(let i = 1; i <= inCount; i++)
            data[`in-${i}`] = false;

        for(let i = 1; i <= outCount; i++)
            data[`out-${i}`] = false;

        return data;
    }

    public getGate(id: string) : Gate | null {
        const count = this.gates.length;
        for(let i = 1; i <= count; i++)
            if(this.gates[i].id == id)
                return this.gates[i];

        return null;
    }

    protected abstract initGate() : Gate;

    public createGate() : void {
        if(this.gatePool.length > 0) {
            const gate = this.gatePool.pop();

            if(gate) {
                gate.id = this.createFunction('and', gate.gateData);
                this.gates.push(gate);
                return;
            }
        }

        const gate = this.initGate();
        allGates.push(gate);
        this.gates.push(gate);
    }

    public deleteGate(id: string) : void {
        const count = this.gates.length;
        for(let i = 0; i <= count; i++)
        {
            if(this.gates[i].id == id) {
                const gate = this.gates[i];
                this.gates.splice(i, 1);
                this.gatePool.push(gate);
                break
            }
        }

    }
}

export class NotGatePool extends GatePool {
    public static instance: NotGatePool;

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateSignature) : void {
        NotGatePool.instance = new NotGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = this.createGameData(1, 1);
        return new NotGate(this.createFunction('not', data), data, this.updateFunction);
    }
}

export class OrGatePool extends GatePool {
    public static instance: OrGatePool;

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateSignature) : void {
        OrGatePool.instance = new OrGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = this.createGameData(2, 1);
        return new OrGate(this.createFunction('or', data), data, this.updateFunction);
    }
}

export class NOrGatePool extends GatePool {
    public static instance: NOrGatePool;

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateSignature) : void {
        NOrGatePool.instance = new NOrGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = this.createGameData(2, 1);
        return new NOrGate(this.createFunction('nor', data), data, this.updateFunction);
    }
}

export class AndGatePool extends GatePool {
    public static instance: AndGatePool;

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateSignature) : void {
        AndGatePool.instance = new AndGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = this.createGameData(2, 1);
        return new AndGate(this.createFunction('and', data), data, this.updateFunction);
    }
}

export class NAndGatePool extends GatePool {
    public static instance: NAndGatePool;

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateSignature) : void {
        NAndGatePool.instance = new NAndGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = this.createGameData(2, 1);
        return new NAndGate(this.createFunction('nand', data), data, this.updateFunction);
    }
}

export class XorGatePool extends GatePool {
    public static instance: XorGatePool;

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateSignature) : void {
        XorGatePool.instance = new XorGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = this.createGameData(2, 1);
        return new XorGate(this.createFunction('xor', data), data, this.updateFunction);
    }
}

export class XNorGatePool extends GatePool {
    public static instance: XNorGatePool;

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateSignature) : void {
        XNorGatePool.instance = new XNorGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = this.createGameData(2, 1);
        return new XNorGate(this.createFunction('xnor', data), data, this.updateFunction);
    }
}

export class BulbGatePool extends GatePool {
    public static instance: BulbGatePool;

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateSignature) : void {
        BulbGatePool.instance = new BulbGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = this.createGameData(1, 0);
        return new BulbGate(this.createFunction('bulb', data), data, this.updateFunction);
    }
}

export class PowerGatePool extends GatePool {
    public static instance: PowerGatePool;

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateSignature) : void {
        PowerGatePool.instance = new PowerGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = this.createGameData(0, 1);

        const id = this.createFunction('power', data);
        const gate = new PowerGate(id, data, this.updateFunction);
        data["toggle"] = () => gate.enable();
        return gate;
    }
}