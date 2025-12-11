<script lang="ts">
    import { BaseEdge, EdgeReconnectAnchor, getBezierPath, type EdgeProps } from '@xyflow/svelte';

    let { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, selected }: EdgeProps = $props();

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

    let reconnecting = $state(false);
</script>

{#if !reconnecting}
    <BaseEdge path={edgePath} />
{/if}
{#if selected}
    <EdgeReconnectAnchor bind:reconnecting type="source" position={{ x: sourceX, y: sourceY }} style={!reconnecting ? 'background: rgba(255, 64, 0, 0.5); border-radius: 100%;' : ''}/>
    <EdgeReconnectAnchor bind:reconnecting type="target" position={{ x: targetX, y: targetY }} style={!reconnecting ? 'background: rgba(255, 64, 0, 0.5); border-radius: 100%;' : ''}/>
{/if}