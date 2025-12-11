import { getContext } from 'svelte';

export const useDragDrop = () => {
    return getContext('drag-drop') as { current: string | null };
};