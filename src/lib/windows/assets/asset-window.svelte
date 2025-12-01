<script lang="ts">
    import { fa8, faClock, faLightbulb, faPowerOff } from "@fortawesome/free-solid-svg-icons";

    import { GateButton, IconGateButton } from "$lib/windows/buttons";
    import { AndGatePool, BulbGatePool,  ClockGatePool, NAndGatePool, NOrGatePool, NotGatePool, OrGatePool, PowerGatePool, SevenSegmentPool, XNorGatePool, XorGatePool } from "$lib/pools/index.js";

    import AssetSelectButton from "$lib/windows/assets/asset-select-button.svelte";

    let core = true;
    const allPrefabs: string[] = [];
    let displayedPrefabs: string[] = [];

    export let onPrefabClick: (prefab: string)  => void;

    export function addPrefab(name: string): void {
        allPrefabs.push(name);
        displayedPrefabs = [...displayedPrefabs, name];
    }

    export function resetPrefabs(): void {
        displayedPrefabs = [...allPrefabs];
    }

    export function filterOutPrefab(name: string): void {
        displayedPrefabs = displayedPrefabs.filter(prefab => prefab !== name);
    }
</script>

<div class="flex flex-col h-auto w-1/2 fixed bottom-0 right-0 mb-8 mr-8 ui-element">
    <div class="flex flex-row justify-start absolute top-0 left-0 -translate-y-full px-2">
        <AssetSelectButton title="Core" onClick={() => { core = true; }} selected={core}></AssetSelectButton>
        <AssetSelectButton title="Prefabs" onClick={() => { core = false; }} selected={!core}></AssetSelectButton>
    </div>
    <div class="flex flex-row items-center min-h-16 w-full overflow-x-auto gap-x-4">
        {#if core }
            <GateButton name="And" color="color-and" onClick={() => AndGatePool.instance.createGate(true)}></GateButton>
            <GateButton name="Or" color="color-or" onClick={() => OrGatePool.instance.createGate(true)}></GateButton>
            <GateButton name="Nand" color="color-nand" onClick={() => NAndGatePool.instance.createGate(true)}></GateButton>
            <GateButton name="Nor" color="color-nor" onClick={() => NOrGatePool.instance.createGate(true)}></GateButton>
            <GateButton name="Not" color="color-not" onClick={() => NotGatePool.instance.createGate(true)}></GateButton>
            <GateButton name="Xor" color="color-xor" onClick={() => XorGatePool.instance.createGate(true)}></GateButton>
            <GateButton name="Xnor" color="color-xnor" onClick={() => XNorGatePool.instance.createGate(true)}></GateButton>
            <IconGateButton fabIcon={faClock} color="color-clock" onClick={() => ClockGatePool.instance.createGate(true)}></IconGateButton>
            <IconGateButton fabIcon={faPowerOff} color="color-power" onClick={() => PowerGatePool.instance.createGate(true)}></IconGateButton>
            <IconGateButton fabIcon={faLightbulb} color="color-bulb" onClick={() => BulbGatePool.instance.createGate(true)}></IconGateButton>
            <IconGateButton fabIcon={fa8} color="color-display" onClick={() => SevenSegmentPool.instance.createGate(true)}></IconGateButton>
        {:else}
            {#if displayedPrefabs.length > 0 }
                {#each displayedPrefabs as prefab}
                    <GateButton name={prefab} color="color-prefab" onClick={() => { onPrefabClick(prefab); }}></GateButton>
                {/each}
            {:else}
                <div class="w-full text-white text-2xl text-center">
                    <b>No Prefabs</b>
                </div>
            {/if}
        {/if}
    </div>
</div>
