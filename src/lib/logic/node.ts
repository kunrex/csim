import type { IEnable } from "$lib/logic/interfaces/i-enable";

export class InNode implements IEnable {
    private readonly inputs: IEnable[] = [];

    public constructor(public readonly id: string, private readonly enableObject: IEnable) { }

    public pushInput(input: IEnable): void {
        this.inputs.push(input);
    }

    public popInput(input: IEnable): void {
        const index = this.inputs.indexOf(input);
        if(index >= 0)
            this.inputs.splice(index, 1);
    }

    public enabled(): boolean {
        return false;
    }

    public enable(): void {
        this.enableObject.enable();
    }

    public disable(): void {
        for(let i = 0; i < this.inputs.length; i++) {
            if (this.inputs[i].enabled())
                return;
        }

        this.enableObject.disable();
    }
}

export class OutNode implements IEnable {
    private state: boolean = false;
    private readonly outputs: IEnable[] = [];

    public constructor(public readonly id: string) { }

    public pushOutput(input: IEnable): void {
        this.outputs.push(input);
    }

    public popOutput(input: IEnable): void {
        const index = this.outputs.indexOf(input);
        if(index >= 0)
            this.outputs.splice(index, 1);
    }

    public enabled(): boolean {
        return this.state;
    }

    public enable(): void {
        const prev = this.state;
        this.state = true;

        if(prev == this.state)
            return;

        for(let i = 0; i < this.outputs.length; i++)
            this.outputs[i].enable();
    }

    public disable(): void {
        const prev = this.state;
        this.state = true;

        if(prev == this.state)
            return;

        for(let i = 0; i < this.outputs.length; i++)
            this.outputs[i].disable();
    }
}
