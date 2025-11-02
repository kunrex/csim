import { Not, Or, NOr, And, NAnd, Xor, XNor, Bulb, Power, Clock, Prefab } from "$lib/circuit/gates";
export { Not, Or, NOr, And, NAnd, Xor, XNor, Bulb, Power, Clock, Prefab };

import { type GateData, type GateType, ConnectionData, type GateDeleteData, type OnDeleteParams } from "$lib/circuit/types";
export { type GateData, type GateType, ConnectionData, type GateDeleteData, type OnDeleteParams };

import { InsertButton, UtilityButton } from "$lib/circuit/buttons";
export { InsertButton, UtilityButton };

import type { NodeTypes } from "@xyflow/svelte";
export const nodeTypes: NodeTypes = {
    "not": Not,
    "or": Or,
    "nor": NOr,
    "and": And,
    "nand": NAnd,
    "xor": Xor,
    "xnor": XNor,
    "bulb": Bulb,
    "power": Power,
    "clock": Clock,
    "prefab": Prefab,
};

import { calculatePrefabData } from "$lib/circuit/utils";
export { calculatePrefabData };

import type { UpdateSignature } from "$lib/circuit/types";
export type { UpdateSignature };