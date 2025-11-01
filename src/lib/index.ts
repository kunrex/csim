import { Gate } from "$lib/logic/gate";
import { EdgeConnection } from "$lib/logic/edge";
import { AndGate, OrGate, NandGate, NorGate, NotGate, XorGate, XnorGate, PowerGate, BulbGate } from "$lib/logic/gates";

export { Gate, AndGate, OrGate, NandGate, NorGate, NotGate, XorGate, XnorGate, EdgeConnection, PowerGate, BulbGate };

import type { GateData, EdgeData } from "$lib/types";

export type { GateData, EdgeData }

import And from "$lib/circuit/gates/and.svelte";
import Nand from "$lib/circuit/gates/nand.svelte";
import Nor from "$lib/circuit/gates/nor.svelte";
import Not from "$lib/circuit/gates/not.svelte";
import Or from "$lib/circuit/gates/or.svelte";
import Xnor from "$lib/circuit/gates/xnor.svelte";
import Xor from "$lib/circuit/gates/xor.svelte";
import Prefab from "$lib/circuit/gates/prefab.svelte";

import Power from "$lib/circuit/nodes/power.svelte"
import Bulb from "$lib/circuit/nodes/bulb.svelte"

import { GateType } from "$lib/types";

export const nodeTypes: NodeTypes = {
    [GateType.And]: And,
    [GateType.Nand]: Nand,
    [GateType.Not]: Not,
    [GateType.Or]: Or,
    [GateType.Nor]: Nor,
    [GateType.Xor]: Xor,
    [GateType.Xnor]: Xnor,
    [GateType.Prefab]: Prefab,
    [GateType.Power]: Power,
    [GateType.Bulb]: Bulb,
};

import InsertButton from "$lib/circuit/insert-button.svelte"
import UtilityButton from "$lib/circuit/utility-button.svelte"

export { InsertButton, UtilityButton };

import Flow from "$lib/circuit/flow.svelte"
import type { NodeTypes } from "@xyflow/svelte";

export { Flow };
