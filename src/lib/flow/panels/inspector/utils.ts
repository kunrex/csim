import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { fa8, faClock, faLightbulb, faMicrochip, faPowerOff, faTablet } from "@fortawesome/free-solid-svg-icons";

import type { GateType } from "$lib/core";

export function iconMap(key: GateType): IconDefinition {
    switch (key) {
        case "not":
        case "and":
        case "nand":
        case "or":
        case "nor":
        case "xor":
        case "xnor":
            return faTablet;
        case "display":
            return fa8;
        case "power":
            return faPowerOff;
        case "clock":
            return faClock;
        case "probe":
            return faLightbulb;
        default:
            return faMicrochip;
    }
}