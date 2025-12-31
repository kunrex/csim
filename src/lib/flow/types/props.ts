import { type NodeProps, type HandleProps, Position } from "@xyflow/svelte";

import type { GateData } from "$lib/core";

import type { RefData } from "$lib/flow/types/index";

export interface GateProps<T extends GateData> extends Pick<NodeProps, 'dragging' | 'selected' | 'parentId'> {
    data: RefData<T>
}

export interface PinProps extends Omit<HandleProps, 'type' | 'id' | 'position'> {
    id: string;
    label: string;
    enabled: boolean;
    position?: Position;
    connectable: boolean;
}

export interface SegmentProps {
    enabled: boolean
}
