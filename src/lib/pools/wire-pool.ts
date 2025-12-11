import { Wire, Pin, type UpdateWireSignature } from "$lib/core";

export class WirePool {
    public static instance: WirePool;
    public static initInstance(updateWireFunction: UpdateWireSignature) : void {
        WirePool.instance = new WirePool(updateWireFunction);
    }

    private edgeCount: number = 0;
    private readonly wires: Wire[] = [];
    private readonly wirePool: Wire[] = [];

    private constructor(private readonly updateFunction: UpdateWireSignature) { }

    public async createWire(source: Pin, target: Pin): Promise<Wire> {
        const wire = (await this.tryReuseWire(source, target)) ?? await this.instantiateWire(source, target);

        await source.pushConnection(wire);
        await target.pushConnection(wire);

        this.wires.push(wire);
        return wire;
    }

    public async deleteWire(id: string, source: Pin, target: Pin): Promise<void> {
        const count = this.wires.length;
        for(let i = 0; i < count; i++) {
            const wire = this.wires[i];

            if(wire.id == id) {
                wire.reset();

                this.wires.splice(i, 1);
                this.wirePool.push(wire);

                await source.popConnection(wire);
                await target.popConnection(wire);
                break;
            }
        }
    }

    private async tryReuseWire(source: Pin, target: Pin) : Promise<Wire | null> {
        if(this.wirePool.length > 0) {
            const edge = this.wirePool.pop();

            if (edge) {
                edge.source = source;
                edge.target = target;

                this.wires.push(edge);
                return edge;
            }
        }

        return null;
    }

    private instantiateWire(source: Pin, target: Pin) : Promise<Wire> {
        return Promise.resolve(new Wire((this.edgeCount++).toString(), source, target, this.updateFunction));
    }
}