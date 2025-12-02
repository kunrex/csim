import { writable } from "svelte/store";

import type { PromptPrefabResult } from "$lib/windows/modals/results";

export class ModalData<T> {
    public constructor(public resolve: (value: T) => void,  public reject: (reason?: any) => void) { }
}

export class Modal<TResult> {
    public readonly state = writable<null | ModalData<TResult>>(null);

    public constructor(public open: () => Promise<TResult>) { }

    public close(): void {
        this.state.set(null);
    }
}

export const promptPrefabModal = new Modal<PromptPrefabResult>(() => {
    return new Promise((resolve: (value: PromptPrefabResult) => void, reject: (reason?: any) => void) => {
        promptPrefabModal.state.set(new ModalData<PromptPrefabResult>(resolve, reject));
    });
})