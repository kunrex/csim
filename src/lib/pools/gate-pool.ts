import { PrefabCircuit } from "$lib/circuits";
import type { GateModel } from "$lib/flow";
import {
    type Gate,
    type GateType,
    NotGate,
    OrGate,
    NorGate,
    AndGate,
    NandGate,
    XorGate,
    XNorGate,
    PowerGate,
    ClockGate,
    ProbeGate,
    SevenSegmentDisplay,
    BufferGate,
    PrefabGate,
    type UpdateGateSignature,
    NotGateType,
    OrGateType,
    NorGateType,
    AndGateType,
    NandGateType,
    XorGateType,
    XnorGateType,
    ProbeGateType,
    PowerGateType, ClockGateType, BufferGateType, DisplayGateType
} from "$lib/core";


interface IGatePool {
    createGate() : Promise<GateModel>;
    deleteGate(gateId: string) : Promise<void>;
}

class GatePool implements IGatePool {
    protected readonly gatePool: Gate[] = [];
    protected readonly gates = new Map<string, Gate>();

    public constructor(private readonly instantiateFunction: () => Gate) { }

    public async createGate() : Promise<GateModel> {
        const gate = (await this.tryReuseGate()) ?? await this.instantiateGate();
        return Promise.resolve({
            id: gate.id,
            nodeType: gate.nodeType,
            gateData: gate.gateData } satisfies GateModel);
    }

    public async deleteGate(gateId: string) : Promise<void> {
        const gate = this.gates.get(gateId);
        if(!gate)
            return;

        await gate.resetState();

        this.gatePool.push(gate);
        this.gates.delete(gateId);
    }

    private tryReuseGate() : Promise<Gate | null> {
        if(this.gatePool.length > 0) {
            const gate = this.gatePool.pop()!;

            this.gates.set(gate.id, gate);
            return Promise.resolve(gate);
        }

        return Promise.resolve(null);
    }

    private instantiateGate() : Promise<Gate> {
        const gate = this.instantiateFunction();
        this.gates.set(gate.id, gate);
        return Promise.resolve(gate);
    }
}

class MasterPrefabGatePool extends GatePool {
    public static instance: MasterPrefabGatePool;
    public static initInstance(instantiateFunction: () => Gate) {
        MasterPrefabGatePool.instance = MasterPrefabGatePool.instance ?? new MasterPrefabGatePool(instantiateFunction);
    }

    private constructor(instantiateFunction: () => Gate) {
        super(instantiateFunction);
    }
}

class PrefabGatePool implements IGatePool {
    public constructor(public readonly circuit: PrefabCircuit) { }
    
    public async createGate(): Promise<GateModel> {
        const base = await MasterPrefabGatePool.instance.createGate();
        const gate = MasterGatePool.instance.getGate(base.id);

        if(gate && gate.nodeType == "prefab") {
            const prefabGate = gate as PrefabGate;
            prefabGate.gateType = base.gateData.type = this.circuit.type;

            await this.circuit.instantiatePrefab(base);
        }

        return base;
    }

    public async deleteGate(gateId: string): Promise<void> {
        await MasterPrefabGatePool.instance.deleteGate(gateId);
    }
}

export class MasterGatePool {
    public static instance: MasterGatePool;
    public static initInstance(updateGateFunction: UpdateGateSignature) : void {
        MasterGatePool.instance = MasterGatePool.instance ?? new MasterGatePool(updateGateFunction);
    }

    private gates = new Map<string, Gate>();
    private pools = new Map<number, IGatePool>();

    private constructor(private readonly updateGateFunction: UpdateGateSignature) {
        this.pools.set(NotGateType.id, new GatePool(() => this.createNotGate()));

        this.pools.set(OrGateType.id, new GatePool(() => this.createOrGate()));
        this.pools.set(NorGateType.id, new GatePool(() => this.createNorGate()));

        this.pools.set(AndGateType.id, new GatePool(() => this.createAndGate()));
        this.pools.set(NandGateType.id, new GatePool(() => this.createNandGate()));

        this.pools.set(XorGateType.id, new GatePool(() => this.createXorGate()));
        this.pools.set(XnorGateType.id, new GatePool(() => this.createXnorGate()));

        this.pools.set(PowerGateType.id, new GatePool(() => this.createPowerGate()));
        this.pools.set(ProbeGateType.id, new GatePool(() => this.createProbeGate()));
        this.pools.set(ClockGateType.id, new GatePool(() => this.createClockGate()));
        this.pools.set(BufferGateType.id, new GatePool(() => this.createBufferGate()));
        this.pools.set(DisplayGateType.id, new GatePool(() => this.createDisplayGate()));

        MasterPrefabGatePool.initInstance(() => this.createPrefabGate());
    }

    public addType(gateType: GateType, circuit: PrefabCircuit) : void {
        if(this.pools.has(gateType.id))
            return;

        const pool = new PrefabGatePool(circuit);
        this.pools.set(gateType.id, pool);
    }

    public deleteType(gateType: GateType) : void {
        this.pools.delete(gateType.id);
    }

    public getGate(gateId: string) : Gate | undefined {
        return this.gates.get(gateId);
    }

    public async createGate(gateType: GateType) : Promise<GateModel | null> {
        const pool = this.pools.get(gateType.id);
        if(!pool)
            return null;

        return await pool.createGate();
    }

    public async deleteGate(gateId: string) : Promise<void> {
        const gate = this.gates.get(gateId);
        if(!gate)
            return;

        const pool = this.pools.get(gate.gateType.id);
        if(!pool)
            return;

        await pool.deleteGate(gateId);
    }

    private createNotGate() : Gate {
        const gate = new NotGate(this.gates.size.toString(), this.updateGateFunction);
        this.gates.set(gate.id, gate);
        return gate;
    }

    private createOrGate() : Gate {
        const gate = new OrGate(this.gates.size.toString(), this.updateGateFunction);
        this.gates.set(gate.id, gate);
        return gate;
    }

    private createNorGate() : Gate {
        const gate = new NorGate(this.gates.size.toString(), this.updateGateFunction);
        this.gates.set(gate.id, gate);
        return gate;
    }

    private createAndGate() : Gate {
        const gate = new AndGate(this.gates.size.toString(), this.updateGateFunction);
        this.gates.set(gate.id, gate);
        return gate;
    }

    private createNandGate() : Gate {
        const gate = new NandGate(this.gates.size.toString(), this.updateGateFunction);
        this.gates.set(gate.id, gate);
        return gate;
    }

    private createXorGate() : Gate {
        const gate = new XorGate(this.gates.size.toString(), this.updateGateFunction);
        this.gates.set(gate.id, gate);
        return gate;
    }

    private createXnorGate() : Gate {
        const gate = new XNorGate(this.gates.size.toString(), this.updateGateFunction);
        this.gates.set(gate.id, gate);
        return gate;
    }

    private createProbeGate() : Gate {
        const gate = new ProbeGate(this.gates.size.toString(), this.updateGateFunction);
        this.gates.set(gate.id, gate);
        return gate;
    }

    private createPowerGate() : Gate {
        const gate = new PowerGate(this.gates.size.toString(), this.updateGateFunction);
        this.gates.set(gate.id, gate);
        return gate;
    }

    private createClockGate() : Gate {
        const gate = new ClockGate(this.gates.size.toString(), this.updateGateFunction);
        this.gates.set(gate.id, gate);
        return gate;
    }

    private createBufferGate() : Gate {
        const gate = new BufferGate(this.gates.size.toString(), this.updateGateFunction);
        this.gates.set(gate.id, gate);
        return gate;
    }

    private createDisplayGate() : Gate {
        const gate = new SevenSegmentDisplay(this.gates.size.toString(), this.updateGateFunction);
        this.gates.set(gate.id, gate);
        return gate;
    }

    private createPrefabGate() : PrefabGate {
        const gate = new PrefabGate(this.gates.size.toString(), this.updateGateFunction);
        this.gates.set(gate.id, gate);
        return gate;
    }
}
