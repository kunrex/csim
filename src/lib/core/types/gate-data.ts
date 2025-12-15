import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type GateType = "not" | "nand" | "and" | "nor" | "or" | "xor" | "xnor" | "probe" | "power" | "buffer" | "display" | string;

export interface GateData {
    name: string,
    type: GateType,
    icon?: IconDefinition

    [key: string] : unknown
}

export type UpdateGateSignature = (id: string, gateData: GateData) => void;

export interface InputGateData extends GateData {
    in1: boolean;
}

export interface OutputGateData extends GateData {
    out1: boolean;

    toggle?: () => void;
}

export interface UnaryGateData extends GateData {
    in1: boolean;
    out1: boolean;

    hideInput?: boolean;
    hideOutput?: boolean;
}

export interface BufferGateData extends GateData {
    in1: boolean;
    out1: boolean;
}

export interface BinaryGateData extends GateData {
    in1: boolean;
    in2: boolean;
    out1: boolean;
}

export interface SevenSegmentGateData extends GateData {
    in1: boolean;
    in2: boolean;
    in3: boolean;
    in4: boolean;
    in5: boolean;

    value: number;
}

export class PinReconnection {
    public constructor(public gateData: GateData, public gateType: GateType) { }
}

export interface PrefabGateData extends GateData {
    expanded: boolean;

    powerCount: number,
    probeCount: number,
    clockCount: number,
    displayCount: number,

    minimumWidth?: number,
    minimumHeight?: number,

    bufferMap: Map<string, { type: "power" | "clock" | "probe" | "display", pin: string }>
}
