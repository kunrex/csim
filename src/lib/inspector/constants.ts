import { fa8, faClock, faLightbulb, faMicrochip, faPowerOff, faTablet } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export function iconMap(key: string): IconDefinition {
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
        case "input":
            return faPowerOff;
        case "clock":
            return faClock;
        case "output":
            return faLightbulb;
        default:
            return faMicrochip;
    }
}