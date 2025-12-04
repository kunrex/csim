import {type CreateGateSignature, edgeId, type GateNodeType, type UpdateGateSignature} from "$lib/circuit";
import {
    Gate,
    AndGate,
    BulbGate,
    NAndGate,
    NOrGate,
    NotGate,
    OrGate,
    XNorGate,
    XorGate,
    ClockGate,
    PowerGate,
    BufferGate,
    SevenSegmentDisplay,
    type GateType,
    PrefabData, type GateData
} from "$lib/logic";

import {createGateData, createPrefabGateData, instantiatePrefabInternals} from "$lib/pools/utils";
import {PrefabGate} from "$lib/logic/gates/gates";
import {CircuitGateData} from "$lib/circuit/types";
import {EdgePool} from "$lib";

const allGates = new Map<string, Gate>();

export function getGate(id: string) : Gate | undefined {
    return allGates.get(id);
}

abstract class GatePool {
    protected readonly gates: Gate[] = [];
    protected readonly gatePool: Gate[] = [];

    protected abstract readonly type: GateType;
    protected abstract readonly nodeType: GateNodeType;

    protected constructor(protected readonly createFunction: CreateGateSignature) { }

    protected abstract initGate() : Gate;

    public createGate(render: boolean) : Gate {
        return this.tryReuseGate(render) ?? this.instantiateGate(render);
    }

    public async deleteGate(id: string) : Promise<void> {
        let i = 0;
        for(const gate of this.gates) {
            if(gate.id == id) {
                await gate.resetState();
                this.gates.splice(i, 1);
                this.gatePool.push(gate);
                break;
            }

            i++;
        }
    }

    private tryReuseGate(render: boolean) : Gate | null {
        if(this.gatePool.length > 0) {
            const gate = this.gatePool.pop()!;
            this.gates.push(gate);

            if(render)
                this.createFunction(this.nodeType, gate);

            gate.sync = render;
            return gate;
        }

        return null;
    }

    private instantiateGate(render: boolean) : Gate {
        const gate = this.initGate();
        allGates.set(gate.id, gate);
        this.gates.push(gate);

        if(render)
            this.createFunction(this.nodeType, gate);

        gate.sync = render;
        return gate;
    }
}

export class NotGatePool extends GatePool {
    public static instance: NotGatePool;
    protected readonly type: GateType = "not";
    protected readonly nodeType: GateNodeType = "unary";

    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) : void {
        NotGatePool.instance = new NotGatePool(createFunction, updateFunction);
    }

    private constructor(createFunction: CreateGateSignature, private readonly updateFunction: UpdateGateSignature) {
        super(createFunction);
    }

    protected initGate(): Gate {
        const data = createGateData(this.type, 1, 1);
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

    private constructor(createFunction: CreateGateSignature, private readonly updateFunction: UpdateGateSignature) {
        super(createFunction);
    }

    protected initGate(): Gate {
        const data = createGateData(this.type, 2, 1);
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

    private constructor(createFunction: CreateGateSignature, private readonly updateFunction: UpdateGateSignature) {
        super(createFunction);
    }

    protected initGate(): Gate {
        const data = createGateData(this.type, 2, 1);
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

    private constructor(createFunction: CreateGateSignature, private readonly updateFunction: UpdateGateSignature) {
        super(createFunction);
    }

    protected initGate(): Gate {
        const data = createGateData(this.type, 2, 1);
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

    private constructor(createFunction: CreateGateSignature, private readonly updateFunction: UpdateGateSignature) {
        super(createFunction);
    }

    protected initGate(): Gate {
        const data = createGateData(this.type, 2, 1);
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

    private constructor(createFunction: CreateGateSignature, private readonly updateFunction: UpdateGateSignature) {
        super(createFunction);
    }

    protected initGate(): Gate {
        const data = createGateData(this.type, 2, 1);
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

    private constructor(createFunction: CreateGateSignature, private readonly updateFunction: UpdateGateSignature) {
        super(createFunction);
    }

    protected initGate(): Gate {
        const data = createGateData(this.type, 2, 1);
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

    private constructor(createFunction: CreateGateSignature, private readonly updateFunction: UpdateGateSignature) {
        super(createFunction);
    }

    protected initGate(): Gate {
        const data = createGateData(this.type, 1, 0);
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

    private constructor(createFunction: CreateGateSignature, private readonly updateFunction: UpdateGateSignature) {
        super(createFunction);
    }

    protected initGate(): Gate {
        const data = createGateData(this.type, 0, 1);

        const id = allGates.size.toString();
        const gate = new ClockGate(id, data, this.updateFunction);
        data["toggle"] = () => gate.toggleClock();
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

    private constructor(createFunction: CreateGateSignature, private readonly updateFunction: UpdateGateSignature) {
        super(createFunction);
    }

    protected initGate(): Gate {
        const data = createGateData(this.type, 0, 1);

        const id = allGates.size.toString();
        const gate = new PowerGate(id, data, this.updateFunction);
        data["toggle"] = () => gate.calculateState();
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

    private constructor(createFunction: CreateGateSignature, private readonly updateFunction: UpdateGateSignature) {
        super(createFunction);
    }

    protected initGate() : Gate {
        const data = createGateData(this.type, 5, 0);
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

    private constructor(createFunction: CreateGateSignature, private readonly updateFunction: UpdateGateSignature) {
        super(createFunction);
    }

    protected initGate() : Gate {
        const data = createGateData(this.type, 1, 1);
        return new BufferGate(allGates.size.toString(), data, this.updateFunction);
    }
}

class PrefabPool extends GatePool {
    protected readonly type: GateType;
    protected readonly nodeType: GateNodeType = "prefab";

    public constructor(public readonly prefabData: PrefabData, createFunction: CreateGateSignature, private readonly updateFunction: UpdateGateSignature) {
        super(createFunction);
        this.type = prefabData.name;
    }

    protected initGate(): Gate {
        const data = createPrefabGateData(this.prefabData);
        const gate = new PrefabGate(allGates.size.toString(), data, this.updateFunction);

        instantiatePrefabInternals(this.prefabData, gate).then();
        return gate;
    }
}

export class PrefabManager {
    public static instance: PrefabManager;
    public static initInstance(createFunction: CreateGateSignature, updateFunction: UpdateGateSignature) {
        this.instance = new PrefabManager(createFunction, updateFunction);
    }

    private readonly pools = new Map<string, PrefabPool>();
    private readonly bufferMap = new Map<string, PrefabGate>();

    private constructor(private readonly createFunction: CreateGateSignature, private readonly updateFunction: UpdateGateSignature) { }

    public hasPrefab(prefabId: string) : boolean {
        return this.pools.has(prefabId);
    }

    public setPrefab(prefabData: PrefabData): void {
        this.pools.set(prefabData.name, new PrefabPool(prefabData, this.createFunction, this.updateFunction));
    }

    public checkEdit(prefab: GateType) : boolean {
        for(const prefab of this.pools)
            if(prefab[1].prefabData.resolveDependency(prefab[0]))
                return false;

        return true;
    }

    public async instantiatePrefabGate(prefab: string, render: boolean): Promise<Gate> {
        return this.pools.get(prefab)!.createGate(render);
    }

    public async deletePrefabGate(gateId: string, prefab: string) : Promise<void> {
        await this.pools.get(prefab)!.deleteGate(gateId);
    }

    public registerBuffer(bufferId: string, prefabGate: PrefabGate) : void {
        this.bufferMap.set(bufferId, prefabGate);
    }

    public unregisterBuffer(bufferId: string) : void {
        this.bufferMap.delete(bufferId);
    }

    public syncBufferUpdate(bufferId: string, gateData: GateData) : void {
        const prefabGate = PrefabManager.instance.bufferMap.get(bufferId);
        if(!prefabGate)
            return;

        prefabGate.syncGateHandle(bufferId, gateData);
    }
}
