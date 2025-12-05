<script lang="ts">
    import { isSegmentOn } from "$lib/flow/utils";
    import VerticalDisplay from "$lib/flow/gates/display/vertical-display.svelte";
    import HorizontalDisplay from "$lib/flow/gates/display/horizontal-display.svelte";
    import { a as A, b as B, c as C, d as D, e as E, f as F, g as G } from "$lib/flow/constants";

    export let value = 0;
    export let decimal = false;
</script>

<div class="flex flex-col relative">
    <div class="flex flex-row justify-center">
        <HorizontalDisplay enabled={isSegmentOn(value, A)}/>
    </div>
    <div class="flex flex-row gap-x-12">
        <VerticalDisplay enabled={isSegmentOn(value, F)}/>
        <VerticalDisplay enabled={isSegmentOn(value, B)}/>
    </div>
    <div class="flex flex-row justify-center">
        <HorizontalDisplay enabled={isSegmentOn(value, G)}/>
    </div>
    <div class="flex flex-row gap-x-12">
        <VerticalDisplay enabled={isSegmentOn(value, E)}/>
        <VerticalDisplay enabled={isSegmentOn(value, C)}/>
    </div>
    <div class="flex flex-row justify-center">
        <HorizontalDisplay enabled={isSegmentOn(value, D)}/>
    </div>
    <div class={`absolute bottom-0 -right-4 w-3 h-3 rounded-full ${decimal ? "!bg-rose-500" : ""}`}></div>
</div>
