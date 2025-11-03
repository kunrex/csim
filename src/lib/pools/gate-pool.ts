import { type GateData, type GateType, type UpdateSignature } from "$lib/circuit";
import { AndGate, BulbGate, Gate, NAndGate, NOrGate, NotGate, OrGate, PowerGate, XNorGate, XorGate } from "$lib/logic";
import {ClockGate} from "$lib/logic/gates";

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

    protected abstract type: GateType;

    protected constructor(protected readonly createFunction: CreateGateSignature, protected readonly updateFunction: UpdateSignature) { }

    protected createGameData(inCount: number, outCount: number) : GateData {
        let data: GateData = { };

        for(let i = 1; i <= inCount; i++) {
            data[`in-${i}`] = false;
            data[`in-${i}-connected`] = false;
        }

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
                gate.id = this.createFunction(this.type, gate.gateData);
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
    protected type: GateType = 'not'

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateSignature) : void {
        NotGatePool.instance = new NotGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = this.createGameData(1, 1);
        return new NotGate(this.createFunction(this.type, data), data, this.updateFunction);
    }
}

export class OrGatePool extends GatePool {
    public static instance: OrGatePool;
    protected type: GateType = 'or';

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateSignature) : void {
        OrGatePool.instance = new OrGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = this.createGameData(2, 1);
        return new OrGate(this.createFunction(this.type, data), data, this.updateFunction);
    }
}

export class NOrGatePool extends GatePool {
    public static instance: NOrGatePool;
    protected type: GateType = 'nor';

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateSignature) : void {
        NOrGatePool.instance = new NOrGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = this.createGameData(2, 1);
        return new NOrGate(this.createFunction(this.type, data), data, this.updateFunction);
    }
}

export class AndGatePool extends GatePool {
    public static instance: AndGatePool;
    protected type: GateType = 'and';

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateSignature) : void {
        AndGatePool.instance = new AndGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = this.createGameData(2, 1);
        return new AndGate(this.createFunction(this.type, data), data, this.updateFunction);
    }
}

export class NAndGatePool extends GatePool {
    public static instance: NAndGatePool;
    protected type: GateType = 'nand';

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateSignature) : void {
        NAndGatePool.instance = new NAndGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = this.createGameData(2, 1);
        return new NAndGate(this.createFunction(this.type, data), data, this.updateFunction);
    }
}

export class XorGatePool extends GatePool {
    public static instance: XorGatePool;
    protected type: GateType = 'xor';

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateSignature) : void {
        XorGatePool.instance = new XorGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = this.createGameData(2, 1);
        return new XorGate(this.createFunction(this.type, data), data, this.updateFunction);
    }
}

export class XNorGatePool extends GatePool {
    public static instance: XNorGatePool;
    protected type: GateType = 'nor';

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateSignature) : void {
        XNorGatePool.instance = new XNorGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = this.createGameData(2, 1);
        return new XNorGate(this.createFunction(this.type, data), data, this.updateFunction);
    }
}

export class BulbGatePool extends GatePool {
    public static instance: BulbGatePool;
    protected type: GateType = 'bulb';

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateSignature) : void {
        BulbGatePool.instance = new BulbGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = this.createGameData(1, 0);
        return new BulbGate(this.createFunction(this.type, data), data, this.updateFunction);
    }
}

export class ClockGatePool extends GatePool {
    public static instance: ClockGatePool;
    protected type: GateType = 'clock';

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateSignature) : void {
        ClockGatePool.instance = new ClockGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = this.createGameData(0, 1);

        const id = this.createFunction(this.type, data);
        const gate = new ClockGate(id, data, this.updateFunction);
        data["toggle"] = () => gate.enable();
        return gate;
    }
}

export class PowerGatePool extends GatePool {
    public static instance: PowerGatePool;
    protected type: GateType = 'power';

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateSignature) : void {
        PowerGatePool.instance = new PowerGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, updateFunction: UpdateSignature) {
        super(createFunction, updateFunction);
    }

    protected initGate(): Gate {
        const data = this.createGameData(0, 1);

        const id = this.createFunction(this.type, data);
        const gate = new PowerGate(id, data, this.updateFunction);
        data["toggle"] = () => gate.enable();
        return gate;
    }
}