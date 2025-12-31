import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import type { GateType } from "$lib/core/gates/types";

export interface GateData {
    name: string,
    type: GateType,
    icon?: IconDefinition

    [key: string] : unknown
}

export interface UnaryOutputData extends GateData {
    out1: boolean
}

export interface InputGateData extends GateData {
    in1: boolean;
}

export interface OutputGateData extends UnaryOutputData {
    out1: boolean;

    toggle?: () => void;
}

export interface UnaryGateData extends UnaryOutputData {
    in1: boolean;
    out1: boolean;

    hideInput?: boolean;
    hideOutput?: boolean;
}

export interface BinaryGateData extends UnaryOutputData {
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

export interface PrefabGateData extends GateData {
    expanded: boolean;

    minimumWidth?: number,
    minimumHeight?: number,

    displaySet: Set<string>,
    bufferMap: Map<string, { type: "power" | "clock" | "probe", pin: string }>
}
