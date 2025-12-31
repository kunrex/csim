import type { Node, Edge } from '@xyflow/svelte';

import type { GateData, WireData } from "$lib/core";

export type GateNodeType = "s-input" | "s-output" | "unary" | "binary" | "prefab" | "display";
export type GateNode = Node<GateData, GateNodeType>;

export type WireEdgeType = "wire" | "internal";
export type WireEdge = Edge<WireData, WireEdgeType>;

import type { AnonymousConnection, IdentifiedConnection } from "$lib/flow/types/connections";
export type { AnonymousConnection, IdentifiedConnection };

import type { GateProps, PinProps, SegmentProps } from "$lib/flow/types/props";
export type { GateProps, PinProps, SegmentProps };

import type { WireModel, GateModel, CircuitModel } from "$lib/flow/types/models";
export type { WireModel, GateModel, CircuitModel }

import type { GateCreationParams, GateCreationCallbackParams } from "$lib/flow/types/params";
export type { GateCreationParams, GateCreationCallbackParams }

import { AssetTypeStore } from "$lib/flow/types/stores";
export { AssetTypeStore };
