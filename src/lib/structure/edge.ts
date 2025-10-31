import { InNode, OutNode } from "$lib/structure/node"
import type { IEnable } from "$lib/structure/interfaces/i-enable";

export class EdgeConnection implements IEnable {
    private state: boolean = false;

    public constructor(public source: OutNode | null, public target: InNode | null) { }

    disable(): void {
        this.target?.disable();
    }

    enable(): void {
        this.target?.enable();
    }

    enabled(): boolean {
        return this.source ? this.source.enabled() : false;
    }
}