<script lang="ts">
    import {Flow, InsertButton} from "$lib";

    import {faLightbulb, faPowerOff} from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
</script>

<div class="flex flex-col h-1/2 fixed top-1/2 right-0 -translate-x-0 -translate-y-1/2 mr-8 justify-evenly align-center gap-8 border-3 border-gray-300 p-4 rounded-2xl backdrop-blur overflow-y-auto z-50">
    <InsertButton name="And" color="var(--color-and)"></InsertButton>
    <InsertButton name="Or" color="var(--color-or)"></InsertButton>
    <InsertButton name="Nand" color="var(--color-nand)"></InsertButton>
    <InsertButton name="Nor" color="var(--color-nor)"></InsertButton>
    <InsertButton name="Not" color="var(--color-not)"></InsertButton>
    <InsertButton name="Xor" color="var(--color-xor)"></InsertButton>
    <InsertButton name="Xnor" color="var(--color-xnor)"></InsertButton>
</div>
<Flow/>