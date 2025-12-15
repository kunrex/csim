import { fa8, faClock, faLightbulb, faPowerOff } from "@fortawesome/free-solid-svg-icons";

import { ConnectionData, type CircuitBlueprint, GateWrapper, WireWrapper } from "$lib/flow";
import { type Gate, NotGate, OrGate, NorGate, AndGate, NandGate, XorGate, XNorGate, PowerGate, ClockGate, ProbeGate, SevenSegmentDisplay, BufferGate, PrefabGate, type GateType, type UnaryGateData, type PrefabGateData, type UpdateGateSignature } from "$lib/core";

import { WirePool } from "$lib/pools/wire-pool";

class GatePool {
    protected readonly gatePool: Gate[] = [];
    protected readonly gates = new Map<string, Gate>();

    public constructor(private readonly instantiateFunction: () => Gate) { }

    public async createGate() : Promise<GateWrapper> {
        const gate = (await this.tryReuseGate()) ?? await this.instantiateGate();
        return Promise.resolve(new GateWrapper(gate.id, gate.nodeType, gate.gateData));
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

class PrefabGatePool extends GatePool {
    public constructor(private readonly blueprint: CircuitBlueprint, instantiateFunction: () => Gate) {
        super(instantiateFunction);
    }
    
    public async createGate(): Promise<GateWrapper> {
        const base = await super.createGate();
        const data = base.gateData as PrefabGateData;
        
        const localGateMap = await this.createChildGates(base, data);
        await this.createChildConnections(base, localGateMap);

        return base;
    }

    private async createChildGates(base: GateWrapper, data: PrefabGateData) : Promise<Map<string, GateWrapper>> {
        base.children = [];
        const localGateMap = new Map<string, GateWrapper>();

        for(const pair of this.blueprint.gates) {
            const type = pair[1].type;

            let gate: GateWrapper | null;
            switch (type) {
                case "power": {
                    gate = await MasterGatePool.instance.createGate("buffer");
                    if(gate) {
                        const gateData = gate.gateData as UnaryGateData;

                        gateData.icon = faPowerOff;
                        gateData.hideInput = true;
                        gateData.hideOutput = false;

                        data.bufferMap.set(gate.id, { type: "power", pin: `in-${++data.powerCount}`});
                    }

                    break;
                }
                case "clock": {
                    gate = await MasterGatePool.instance.createGate("buffer");
                    if(gate) {
                        const gateData = gate.gateData as UnaryGateData;

                        gateData.icon = faClock;
                        gateData.hideInput = true;
                        gateData.hideOutput = false;

                        data.bufferMap.set(gate.id, { type: "clock", pin: `clock-${++data.clockCount}`});
                    }

                    break;
                }
                case "probe": {
                    gate = await MasterGatePool.instance.createGate("buffer");
                    if(gate) {
                        const gateData = gate.gateData as UnaryGateData;

                        gateData.icon = faLightbulb;
                        gateData.hideOutput = true;
                        gateData.hideInput = false;

                        data.bufferMap.set(gate.id, { type: "probe", pin: `out-${++data.probeCount}`});
                    }

                    break;
                }
                case "display": {
                    gate = await MasterGatePool.instance.createGate("display");
                    if(!gate)
                        break;

                    for(let i = 1; i <= 5; i++) {
                        const buffer = await MasterGatePool.instance.createGate("buffer");
                        if(buffer) {
                            const gateData = gate.gateData as UnaryGateData;

                            gateData.icon = fa8;
                            gateData.hideInput = false;
                            gateData.hideOutput = true;

                            data.bufferMap.set(buffer.id, { type: "display", pin: `display-${++data.displayCount}`});

                            base.children.push(buffer);
                            localGateMap.set(`${pair[0]}-in-${i}`, buffer);
                        }
                    }

                    break;
                }
                default:
                    gate = await MasterGatePool.instance.createGate(type);
                    break;
            }

            if(gate) {
                gate.gateData.name = pair[1].name;

                base.children.push(gate);
                localGateMap.set(pair[0], gate);
            }
        }

        return localGateMap;
    }

    private async createChildConnections(base: GateWrapper, localGateMap: Map<string, GateWrapper>) : Promise<void> {
        base.connections = [];
        for(const connection of this.blueprint.connections) {
            const source = localGateMap.get(connection.source);
            const target = localGateMap.get(connection.target);

            if(!source || !target)
                continue;

            const sourceGate = MasterGatePool.instance.getGate(source.id);
            const targetGate = MasterGatePool.instance.getGate(target.id);

            if(!sourceGate || !targetGate)
                continue;

            const sourcePin = sourceGate.getPin(connection.sourceHandle);
            const targetPin = targetGate.getPin(connection.targetHandle);

            if(!sourcePin || !targetPin)
                continue;

            const wire = await WirePool.instance.createWire(sourcePin, targetPin);
            base.connections.push(new WireWrapper(new ConnectionData(wire.id, sourceGate.id, targetGate.id, connection.sourceHandle, connection.targetHandle), wire.wireData));

            if(targetGate.gateType == "display") {
                const targetBuffer = localGateMap.get(`${connection.target}-${connection.targetHandle}`);
                if(!targetBuffer)
                    return;

                const targetBufferGate = MasterGatePool.instance.getGate(targetBuffer.id);
                if(!targetBufferGate)
                    return;

                const bufferWire = await WirePool.instance.createWire(sourcePin, targetBufferGate.getPin("in-1")!);
                base.connections.push(new WireWrapper(new ConnectionData(bufferWire.id, sourceGate.id, targetBufferGate.id, connection.sourceHandle, "in-1"), bufferWire.wireData));
            }
        }
    }
}

export class MasterGatePool {
    public static instance: MasterGatePool;
    public static initInstance(updateGateFunction: UpdateGateSignature) : void {
        MasterGatePool.instance = new MasterGatePool(updateGateFunction);
    }

    private gates = new Map<string, Gate>();
    private pools = new Map<GateType, GatePool>();

    private constructor(private readonly updateGateFunction: UpdateGateSignature) {
        this.pools.set("not", new GatePool(() => this.createNotGate()));

        this.pools.set("or", new GatePool(() => this.createOrGate()));
        this.pools.set("nor", new GatePool(() => this.createNorGate()));

        this.pools.set("and", new GatePool(() => this.createAndGate()));
        this.pools.set("nand", new GatePool(() => this.createNandGate()));

        this.pools.set("xor", new GatePool(() => this.createXorGate()));
        this.pools.set("xnor", new GatePool(() => this.createXnorGate()));

        this.pools.set("probe", new GatePool(() => this.createProbeGate()));
        this.pools.set("power", new GatePool(() => this.createPowerGate()));
        this.pools.set("clock", new GatePool(() => this.createClockGate()));
        this.pools.set("buffer", new GatePool(() => this.createBufferGate()));
        this.pools.set("display", new GatePool(() => this.createDisplayGate()));
    }

    public hasType(type: GateType) : boolean {
        return this.pools.has(type.toLowerCase());
    }

    public getGate(gateId: string) : Gate | undefined {
        return this.gates.get(gateId);
    }

    public addGateType(gateType: GateType, blueprint: CircuitBlueprint) {
        const pool = new PrefabGatePool(blueprint, () => this.createPrefabGate(gateType));
        this.pools.set(gateType.toLowerCase(), pool);
    }

    public async createGate(gateType: GateType) : Promise<GateWrapper | null> {
        const pool = this.pools.get(gateType.toLowerCase());
        if(!pool)
            return null;

        return await pool.createGate();
    }

    public async deleteGate(gateId: string) : Promise<void> {
        const gate = this.gates.get(gateId);
        if(!gate)
            return;

        const pool = this.pools.get(gate.gateType);
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

    private createPrefabGate(gateType: GateType) : PrefabGate {
        const gate = new PrefabGate(this.gates.size.toString(), gateType, this.updateGateFunction);
        this.gates.set(gate.id, gate);
        return gate;
    }
}