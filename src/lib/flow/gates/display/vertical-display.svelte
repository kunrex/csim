<script lang="ts">
    import type { SegmentProps } from "$lib/flow/types/props";

    let { enabled } : SegmentProps= $props();
</script>

<div class="vertical-segment" class:enabled></div>