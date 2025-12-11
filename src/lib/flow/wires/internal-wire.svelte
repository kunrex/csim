<script lang="ts">
    import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/svelte';

    let { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition }: EdgeProps = $props();

    const [edgePath] = $derived(
        getBezierPath({
            sourceX,
            sourceY,
            sourcePosition,
            targetX,
            targetY,
            targetPosition,
        }),
    );
</script>

<BaseEdge path={edgePath} />