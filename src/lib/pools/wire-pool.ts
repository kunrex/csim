import { Wire, Pin, type UpdateWireSignature } from "$lib/core";

export class WirePool {
    public static instance: WirePool;
    public static initInstance(updateWireFunction: UpdateWireSignature) : void {
        WirePool.instance = WirePool.instance ?? new WirePool(updateWireFunction);
    }

    private wireCount: number = 0;
    private readonly wirePool: Wire[] = [];
    private readonly wires = new Map<string, Wire>();

    private constructor(private readonly updateFunction: UpdateWireSignature) { }

    public async createWire(source: Pin, target: Pin): Promise<Wire> {
        const wire = (await this.tryReuseWire(source, target)) ?? await this.instantiateWire(source, target);

        await source.pushConnection(wire);
        await target.pushConnection(wire);

        this.wires.set(wire.id, wire);
        return wire;
    }

    public async deleteWire(id: string, source: Pin, target: Pin): Promise<void> {
        const wire = this.wires.get(id);
        if(!wire)
            return;

        wire.reset();

        this.wires.delete(id);
        this.wirePool.push(wire);

        await source.popConnection(wire);
        await target.popConnection(wire);
    }

    private async tryReuseWire(source: Pin, target: Pin) : Promise<Wire | null> {
        if(this.wirePool.length > 0) {
            const wire = this.wirePool.pop();

            if (wire) {
                wire.source = source;
                wire.target = target;

                return wire;
            }
        }

        return null;
    }

    private instantiateWire(source: Pin, target: Pin) : Promise<Wire> {
        return Promise.resolve(new Wire((this.wireCount++).toString(), source, target, this.updateFunction));
    }
}