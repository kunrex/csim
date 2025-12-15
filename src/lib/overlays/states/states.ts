import { writable } from "svelte/store";

class Returnable<T> {
    public constructor(public resolve: (value: T) => void,  public reject: (reason?: any) => void) { }
}

class ReturnableOverlayState<TResult> {
    public readonly state = writable<null | Returnable<TResult>>(null);

    public constructor(public open: () => Promise<TResult>) { }

    public close(): void {
        this.state.set(null);
    }
}

class OverlayState<TParams> {
    public readonly state = writable<null | TParams>(null);

    public constructor() { }

    public open(params: TParams) : void {
        this.state.set(params);
    }

    public close() : void {
        this.state.set(null);
    }
}

interface PrefabOverlayResult {
    value: string,
    result: boolean
}

export const prefabOverlay = new ReturnableOverlayState<PrefabOverlayResult>(() => {
    return new Promise((resolve: (value: PrefabOverlayResult) => void, reject: (reason?: any) => void) => {
        prefabOverlay.state.set(new Returnable<PrefabOverlayResult>(resolve, reject));
    });
});

interface MessageOverlayParams {
    title: string,
    message: string
}

export const loopGuardOverlay = new OverlayState<true>();
export const loadingOverlay = new OverlayState<string>();
export const messageOverlay = new OverlayState<MessageOverlayParams>();
