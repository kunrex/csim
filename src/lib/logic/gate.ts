import type { IEnable } from "$lib/logic/interfaces/i-enable";

export abstract class Gate implements IEnable {
    protected state: boolean = false;

    protected constructor(public readonly id: string) { }

    public enabled(): boolean {
        return this.state;
    }

    public disable(): void { }
    public abstract enable(): void;

    public abstract getNode(id: string) : IEnable | null;
}