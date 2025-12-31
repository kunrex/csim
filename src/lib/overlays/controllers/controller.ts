import { writable } from "svelte/store";

export interface IOverlayController<TParams, TResult> {
    open(params: TParams): Promise<TResult>,
    close(): void
}

export interface ControllerOptions<TParams, TResult> {
    params: TParams,
    resolve: (value: TResult) => void
}

export class OverlayController<TParams, TResult> implements IOverlayController<TParams, TResult> {
    public readonly state = writable<null | ControllerOptions<TParams, TResult>>(null);

    public constructor() { }

    public async open(params: TParams): Promise<TResult> {
        return new Promise((resolve: (value: TResult) => void) => {
            this.state.set({
                params: params,
                resolve: resolve,
            });
        })
    }

    public close() : void {
        this.state.set(null);
    }
}
