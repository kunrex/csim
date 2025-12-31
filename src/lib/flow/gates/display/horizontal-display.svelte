<script lang="ts">
    import type { SegmentProps } from "$lib/flow/types";

    let { enabled } : SegmentProps= $props();
</script>

<div class="horizontal-segment" class:enabled></div>