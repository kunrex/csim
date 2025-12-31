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

let index = 0;
let dependencyMap = new Map<number, GateType>();

function createBaseType(name: string) : MutableGateType {
    const gateType: MutableGateType = {
        id: index++,

        name: name,
        kind: "base",
    } satisfies MutableGateType;

    dependencyMap.set(gateType.id, gateType);
    return gateType;
}

export function createAssetType(name: string) : MutableAssetGateType {
    const gateType: MutableAssetGateType = {
        id: index++,

        name: name,
        kind: "asset",
        dependencies: new Map
    } satisfies MutableAssetGateType;

    dependencyMap.set(gateType.id, gateType);
    return gateType;
}

export function getGateType(id: number) : GateType | null {
    return dependencyMap.get(id) ?? null;
}

export const NotGateType = createBaseType("not");

export const AndGateType = createBaseType("and");
export const NandGateType = createBaseType("nand");

export const OrGateType = createBaseType("or");
export const NorGateType = createBaseType("nor");

export const XorGateType = createBaseType("xor");
export const XnorGateType = createBaseType("xnor");

export const PowerGateType = createBaseType("power");
export const ClockGateType = createBaseType("clock");
export const ProbeGateType = createBaseType("probe");
export const DisplayGateType = createBaseType("display");
export const BufferGateType = createBaseType("buffer");

export const UndefinedGateType = createBaseType("");