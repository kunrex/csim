import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { fa8, faClock, faLightbulb, faPowerOff } from "@fortawesome/free-solid-svg-icons";

import {
    AndGateType, ClockGateType, DisplayGateType,
    type GateType,
    NandGateType,
    NorGateType,
    NotGateType,
    OrGateType, PowerGateType, ProbeGateType,
    XnorGateType,
    XorGateType
} from "$lib/core";
import type { TitleMessageParams } from "$lib/overlays/controllers";

export const a = 'a', b = 'b', c = 'c', d = 'd', e = 'e', f = 'f', g = 'g';
export const segments = [a, b, c, d, e, f, g];
export const sevenSegmentBits: Record<number, number> = {
    0: 0b0111111,
    1: 0b0000110,
    2: 0b1011011,
    3: 0b1001111,
    4: 0b1100110,
    5: 0b1101101,
    6: 0b1111101,
    7: 0b0000111,
    8: 0b1111111,
    9: 0b1101111,

    10: 0b1110111,
    11: 0b1111100,
    12: 0b0111001,
    13: 0b1011110,
    14: 0b1111001,
    15: 0b1110001,
};


export const nonIconGateTypes = [NotGateType, AndGateType, NandGateType, OrGateType, NorGateType, XorGateType, XnorGateType];
export const iconGateTypes: [GateType, IconDefinition][] = [[PowerGateType, faPowerOff], [ClockGateType, faClock], [ProbeGateType, faLightbulb], [DisplayGateType, fa8]];

export const prefabHandleGap = 20;

export const inputNotFoundParams = {
    title: "Couldn't Generate Prefab",
    message: "Prefabs must have at least one input node. This can be a clock signal or a power signal."
} satisfies TitleMessageParams;

export const outputNotFoundParams = {
    title: "Couldn't Generate Prefab",
    message: "Prefabs must have at least one output node. This can be a probe gate or a 7 segment display."
} satisfies TitleMessageParams;

export const saveConfirmationParams = {
    title: "Save State",
    message: "Save the current state of this circuit?"
} satisfies TitleMessageParams;

export const deletionConfirmationParams = {
    title: "Deletion Confirmation",
    message: "This action cannot be undone and other circuits may be dependant on this circuit."
} satisfies TitleMessageParams;
