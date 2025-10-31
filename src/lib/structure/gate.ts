import type { IEnable } from "$lib/structure/interfaces/i-enable";

export abstract class Gate implements IEnable {
    protected state: boolean = false;

    public enabled(): boolean {
        return this.state;
    }

    public disable(): void { }
    public abstract enable(): void;
}