<script lang="ts">
    import {SvelteFlowProvider} from "@xyflow/svelte";

    import { Flow, InsertButton } from "$lib";

    let flow: any;
    const spawnFunctions = {
        "and": () => flow.addNode('and'),
        "or": () => flow.addNode('or'),
        "nand": () => flow.addNode('nand'),
        "nor": () => flow.addNode('nor'),
        "not": () => flow.addNode('not'),
        "xor": () => flow.addNode('xor'),
        "xnor": () => flow.addNode('xnor'),
    }
</script>

<div class="flex flex-col h-1/2 fixed top-1/2 right-0 -translate-x-0 -translate-y-1/2 mr-8 justify-evenly align-center gap-8 border-3 border-gray-300 p-4 rounded-2xl backdrop-blur overflow-y-auto z-50">
    <InsertButton name="And" color="var(--color-and)" onClick={spawnFunctions["and"]}></InsertButton>
    <InsertButton name="Or" color="var(--color-or)" onClick={spawnFunctions["or"]}></InsertButton>
    <InsertButton name="Nand" color="var(--color-nand)" onClick={spawnFunctions["nand"]}></InsertButton>
    <InsertButton name="Nor" color="var(--color-nor)" onClick={spawnFunctions["nor"]}></InsertButton>
    <InsertButton name="Not" color="var(--color-not)" onClick={spawnFunctions["not"]}></InsertButton>
    <InsertButton name="Xor" color="var(--color-xor)" onClick={spawnFunctions["xor"]}></InsertButton>
    <InsertButton name="Xnor" color="var(--color-xnor)" onClick={spawnFunctions["xnor"]}></InsertButton>
</div>
<SvelteFlowProvider>
    <Flow bind:this={flow}/>
</SvelteFlowProvider>
