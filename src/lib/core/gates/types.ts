export interface MutableGateType {
    readonly id: number,

    name: string;
    kind: "base";
}

export interface MutableAssetGateType extends Omit<MutableGateType, 'kind'> {
    kind: "asset";
    dependencies: Map<number, number>;
}

export interface AssetGateType extends Readonly<Omit<MutableAssetGateType, 'dependencies'>> {
    dependencies: ReadonlyMap<number, number>;
}

export type GateType = Readonly<Readonly<MutableGateType> | AssetGateType>;
