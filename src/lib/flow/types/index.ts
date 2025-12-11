import type { Node, Edge } from '@xyflow/svelte';

import { type GateData, type GateType, type WireData } from "$lib/core";

export type GateNodeType = "s-input" | "s-output" | "unary" | "binary" | "prefab" | "display";
export type GateNode = Node<GateData, GateNodeType>;

export type WireEdgeType = "wire" | "internal";
export type WireEdge = Edge<WireData, WireEdgeType>;

import { CircuitBlueprint, CircuitGateData } from "$lib/flow/types/circuit-blueprint";
export { CircuitBlueprint, CircuitGateData };

import { CoreConnectionData, ConnectionData } from "$lib/flow/types/conection-data";
export { CoreConnectionData, ConnectionData };

import type { GateProps, PinProps } from "$lib/flow/types/props";
export type { GateProps, PinProps };

export class WireWrapper {
    public constructor(public readonly connectionData: ConnectionData, public readonly wireData: WireData) { }
}

export class GateWrapper {
    public constructor(public readonly id: string, public readonly nodeType: GateNodeType, public readonly gateData: GateData, public children?: GateWrapper[], public connections?: WireWrapper[]) { }
}

export class CreateGateData {
    public constructor(public readonly type: GateType, public readonly x: number, public readonly y: number) { }
}

export class CreateGateCallback {
    public constructor(public readonly creation: CreateGateData, public readonly gate: GateWrapper) { }
}

export interface LayoutGate {

}
