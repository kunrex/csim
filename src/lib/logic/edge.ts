import type { IEnable } from "$lib/logic/interfaces/i-enable";

export class EdgeConnection implements IEnable {
    private state: boolean = false;

    public constructor(public id: string, public source: IEnable | null, public target: IEnable | null) { }

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