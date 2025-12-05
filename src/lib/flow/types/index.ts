import type { Node } from '@xyflow/svelte';

import { Gate, type GateData, type GateType } from "../../core";

export type GateNodeType = "s-input" | "s-output" | "unary" | "binary" | "prefab" | "display";
export type GateNode = Node<GateData, GateNodeType>;

export type CreateGateSignature = (type: GateNodeType, gate: Gate) => void;
export type UpdateGateSignature = (id: string, gateData: GateData) => void;
export type UpdateConnectionSignature = (id: string, animated: boolean) => void;

import { CircuitData, CircuitGateData } from "$lib/flow/types/circuit-data";
export { CircuitData, CircuitGateData };

export type ClearCircuitSignature = () => void;
export type GetCircuitSignature = () => CircuitData;

import { CoreConnectionData, ConnectionData } from "$lib/flow/types/conection-data";
export { CoreConnectionData, ConnectionData };

export class CoreGateData {
    public constructor(public readonly id: string, public readonly type: GateType) { }
}