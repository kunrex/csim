import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { fa8, faClock, faLightbulb, faPowerOff } from "@fortawesome/free-solid-svg-icons";

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
};

import type { GateType } from "$lib/core";
export const nonIconGateTypes = ["not", "and", "nand", "or", "nor", "xor", "xnor"];
export const iconGateTypes: [GateType, IconDefinition][] = [["power", faPowerOff], ["clock", faClock], ["bulb", faLightbulb], ["display", fa8]];
