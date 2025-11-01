import { AndGate, OrGate, NandGate, NorGate, NotGate, XorGate, XnorGate } from "$lib/structure/gates";

export { AndGate, OrGate, NandGate, NorGate, NotGate, XorGate, XnorGate };

import And from "$lib/components/gates/and.svelte";
import Nand from "$lib/components/gates/nand.svelte";
import Nor from "$lib/components/gates/nor.svelte";
import Not from "$lib/components/gates/not.svelte";
import Or from "$lib/components/gates/or.svelte";
import Xnor from "$lib/components/gates/xnor.svelte";
import Xor from "$lib/components/gates/xor.svelte";

export const nodeTypes: NodeTypes = {
    and: And,
    nand: Nand,
    not: Not,
    or: Or,
    nor: Nor,
    xor: Xor,
    xnor: Xnor,
    power: Power,
    bulb: Bulb
};

export { And, Nand, Nor, Not, Or, Xnor, Xor };

import Power from "$lib/components/nodes/power.svelte"
import Bulb from "$lib/components/nodes/bulb.svelte"

export { Power };
export { Bulb };

import InsertButton from "$lib/insert-button.svelte"

export { InsertButton };

import Flow from "$lib/flow.svelte"
import type {NodeTypes} from "@xyflow/svelte";

export { Flow };
