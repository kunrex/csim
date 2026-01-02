import { writable, type Writable, type Readable } from "svelte/store";

import type { AssetGateType } from "$lib/core";

export class AssetTypeStore {
    public readonly state: Readable<AssetGateType>;
    private readonly mutableState: Writable<AssetGateType>;

    public constructor(public readonly gateType: AssetGateType) {
        this.state = this.mutableState = writable(gateType);
    }

    public refresh() : void {
        this.mutableState.set(this.gateType);
    }
}
