import { getContext } from 'svelte';

import type { GateType } from "$lib/core";

export const dragDropProvider = () => {
    return getContext('drag-drop') as { current: GateType | null };
};
