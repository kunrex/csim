import type { EdgeData } from "$lib/types";
import type { IEnable } from "$lib/logic/interfaces/i-enable";

export class EdgeConnection implements IEnable {
    private state: boolean = false;
    public readonly edgeData: EdgeData = { };

    public constructor(public id: string, public source: IEnable | null, public target: IEnable | null) { }

    disable(): void {
        this.target?.disable();
        this.edgeData["enabled"] = false;
    }

    enable(): void {
        this.target?.enable();
        this.edgeData["enabled"] = true;
    }

    enabled(): boolean {
        return this.source ? this.source.enabled() : false;
    }
}