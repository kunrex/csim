import { EdgeConnection, Handle } from "$lib/core";
import type { UpdateConnectionSignature } from "$lib/flow";

export class EdgePool {
    private readonly edges: EdgeConnection[] = [];
    private readonly edgePool: EdgeConnection[] = [];

    public static instance: EdgePool;

    public static initInstance(signature: UpdateConnectionSignature) : void {
        EdgePool.instance = new EdgePool(signature);
    }

    private constructor(private readonly updateEdgeFunction: UpdateConnectionSignature) { }

    public async createEdgeConnection(id: string, source: Handle, target: Handle): Promise<void> {
        if(this.edgePool.length > 0) {
            const edge = this.edgePool.pop();

            if (edge) {
                edge.id = id;
                edge.source = source;
                edge.target = target;

                await source.pushConnection(edge);
                await target.pushConnection(edge);

                this.edges.push(edge);
            }
        } else {
            const edge = new EdgeConnection(id, source, target, this.updateEdgeFunction);

            await source.pushConnection(edge);
            await target.pushConnection(edge);

            this.edges.push(edge);
        }
    }

    public async deleteEdgeConnection(id: string, source: Handle, target: Handle): Promise<void> {
        const count = this.edges.length;
        for(let i = 0; i < count; i++) {
            const edge = this.edges[i];
            if(edge.id == id) {
                this.edges.splice(i, 1);
                this.edgePool.push(edge);

                await source.popConnection(edge);
                await target.popConnection(edge);
                break;
            }
        }
    }
}