<script lang="ts">
    import { useNodes, type XYPosition, useSvelteFlow } from "@xyflow/svelte";
    import {RectangleSelection} from "$lib/flow/selection/index";

    const { screenToFlowPosition, getViewport, getInternalNode } = useSvelteFlow();

    interface RectangleSelectionProps {
        onNodesSelect: (selected: Set<string>) => void;
    }

    let { onNodesSelect } : RectangleSelectionProps = $props();

    const nodes = useNodes();

    let selected = $state(false);

    let end: XYPosition | null = $state(null);
    let start: XYPosition | null = $state(null);

    let rect = $derived(
         start && end ? {
             position: getTopLeft(start, end),
             dimension: getDimensions(start, end, 1)
         } : null
    );

    function onKeyDown(e: KeyboardEvent) : void {
        if(e.key == "Shift")
            selected = true;
    }

    function onKeyUp(e: KeyboardEvent) : void {
        if(e.key == "Shift")
            selected = false;
    }

    function getTopLeft(start: XYPosition, end: XYPosition) {
        return {
            x: Math.min(start.x, end.x),
            y: Math.min(start.y, end.y),
        };
    }

    function getDimensions(start: XYPosition, end: XYPosition, zoom: number) {
        return {
            width: Math.abs(end.x - start.x) / zoom,
            height: Math.abs(end.y - start.y) / zoom,
        };
    }

    function onPointerDown(e: PointerEvent) : void {
        const target = e.target as HTMLElement;
        target.setPointerCapture(e.pointerId)

        if(selected)
            start = { x: e.pageX, y: e.pageY };
    }

    function onPointerMove(e: PointerEvent) : void {
        if (e.buttons !== 1)
            return;

        end = { x: e.pageX, y: e.pageY };
    }

    function checkIntersection(topLeft1: XYPosition, bottomRight1: XYPosition, topLeft2: XYPosition, bottomRight2: XYPosition) : boolean {
        return (topLeft1.x > bottomRight2.x || topLeft2.x > bottomRight1.x) || (bottomRight1.y > topLeft2.y || bottomRight2.y > topLeft1.y);
    }

    const selectedNodes = new Set<string>();
    function onPointerUp(e: PointerEvent) : void {
        if(!start || !end)
            return;

        const selectionTopLeft = screenToFlowPosition(getTopLeft(start, end));
        const dimension = getDimensions(start, end, getViewport().zoom);

        const selectionBottomRight: XYPosition = { x: selectionTopLeft.x + dimension.width, y: selectionTopLeft.y + dimension.height };

        selectedNodes.clear();
        for(const node of nodes.current) {
            const internalNode = getInternalNode(node.id);
            if(!internalNode)
                continue;

            const topLeft = internalNode.internals.positionAbsolute;
            const { width = 0, height = 0 } = internalNode.measured;
            const bottomRight = { x: topLeft.x + width, y: topLeft.y + height };

            if(checkIntersection(selectionTopLeft, selectionBottomRight, topLeft, bottomRight))
                selectedNodes.add(node.id);
        }

        if(selectedNodes.size > 0)
            onNodesSelect(selectedNodes);

        start = end = null;
    }
</script>

<div class="pointer-events-auto absolute top-0 left-0 h-full w-full origin-top-left touch-none" role="button" tabindex="0" onpointerdown={onPointerDown} onpointermove={onPointerMove} onpointerup={onPointerUp} onkeydown={onKeyDown} onkeyup={onKeyUp}>
    {#if rect}
        <div class="absolute z-40 pointer-events-none border-2 border-dashed border-[#0059dc]/80" style="width: {rect.dimension.width}px; height: {rect.dimension.height}px; transform: translate({rect.position.x}px, {rect.position.y}px);"></div>
    {/if}
</div>