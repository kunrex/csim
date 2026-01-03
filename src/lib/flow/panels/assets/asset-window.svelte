<script lang="ts">
    import { Panel } from "@xyflow/svelte";

    import { playAudio } from "$lib/audio";
    import type { GateType, AssetGateType } from "$lib/core";

    import { nonIconGateTypes, iconGateTypes } from "$lib/flow/constants";

    import { dragDropProvider } from "$lib/flow/drag-drop";
    import {AssetTypeStore, type GateCreationParams} from "$lib/flow/types";

    import AssetWindow from "$lib/flow/panels/assets/asset-window-button.svelte";
    import OpenCircuit from "$lib/flow/panels/assets/open-circuit-button.svelte";
    import InstantiateGate from "$lib/flow/panels/assets/instantiate-gate-button.svelte";
    import InstantiatePrefabGate from "$lib/flow/panels/assets/instantiate-prefab-gate-button.svelte";

    interface AssetProps {
        openAssetCallback: (gateType: GateType) => void;
        deleteAssetCallback: (gateType: GateType) => void;
    }

    type AssetType = "core" | "prefabs" | "circuits";

    interface Asset {
        id: number,
        assetType: AssetType,
        typeStore: AssetTypeStore,
    }

    let { openAssetCallback, deleteAssetCallback } : AssetProps = $props();

    let window: AssetType = $state.raw("core");

    let assets: Asset[] = $state.raw([]);
    let openAsset: Asset | null = $state.raw(null);

    let prefabFlag: boolean = $state.raw(false);

    const type = dragDropProvider();
    function onDrop(event: DragEvent) : void {
        event.preventDefault();

        if (!type.current)
            return;

        type.current = null;
    }

    export function openAssetHandler(gateType: GateType) : AssetTypeStore | null {
        for(const asset of assets)
            if(asset.typeStore.gateType == gateType) {
                openAsset = asset;
                return asset.typeStore;
            }

        return null;
    }

    export function addAssetHandler(gateType: AssetGateType, assetType: AssetType) : void {
        assets = [...assets, {
            id: gateType.id,
            assetType: assetType,
            typeStore: new AssetTypeStore(gateType)
        } satisfies Asset];

        window = assetType;
        prefabFlag = prefabFlag || assetType == "prefabs";
    }

    export function deleteAssetHandler(gateType: GateType) : void {
        assets = assets.filter(asset => asset.typeStore.gateType.id != gateType.id);
    }

    function chooseAssetType(assetType: AssetType) : void {
        window = assetType;
        playAudio("click");
    }

    function checkOpenAssetCircuitDependency(asset: Asset) : boolean {
        if(openAsset == null)
            return false;

        return asset.id == openAsset.id;
    }

    function checkOpenAssetPrefabDependency(asset: Asset) : boolean {
        if(openAsset == null)
            return false;

        return asset.id == openAsset.id || asset.typeStore.gateType.dependencies.has(openAsset.id);
    }
</script>

<Panel class="flex flex-col h-auto w-1/2 min-w-80 relative panel-background pt-0" position="bottom-right" ondrop={onDrop}>
    <div class="flex flex-row justify-start absolute top-0 left-0 -translate-y-full px-2">
        <AssetWindow title="Core" onclick={() => chooseAssetType("core")} selected={window === "core"}></AssetWindow>
        <AssetWindow title="Prefabs" onclick={() => chooseAssetType("prefabs")} selected={window === "prefabs"}></AssetWindow>
        <AssetWindow title="Circuits" onclick={() => chooseAssetType("circuits")} selected={window === "circuits"}></AssetWindow>
    </div>
    <div class="flex flex-row justify-center items-center w-full font-extralight text-gray-500 p-2">
        {#if window === "circuits"}
            Double click to open circuits
        {:else}
            Drag and drop gates into the circuit
        {/if}
    </div>
    <div class="flex flex-row items-center min-h-16 w-full overflow-x-auto gap-x-4">
        {#if window === "core" }
            {#each nonIconGateTypes as type (type.id)}
                <InstantiateGate type={type} color={`color-${type.name}`} />
            {/each}
            {#each iconGateTypes as type (type[0].id)}
                <InstantiateGate type={type[0]} color={`color-${type[0].name}`} fabIcon={type[1]} />
            {/each}
        {:else if window === "prefabs"}
            {#if prefabFlag}
                {#each assets as asset (asset.id)}
                    {#if asset.assetType === window}
                        <InstantiatePrefabGate disabled={checkOpenAssetPrefabDependency(asset)} deletable={asset !== openAsset} typeStore={asset.typeStore} openPrefabCallback={openAssetCallback} deletePrefabCallback={deleteAssetCallback} />
                    {/if}
                {/each}
            {:else}
                <div class="flex flex-row justify-center items-center w-full font-bold text-2xl text-slate-300">
                    No Prefabs
                </div>
            {/if}
        {:else}
            {#each assets as asset (asset.id)}
                {#if asset.assetType === window}
                    <OpenCircuit disabled={checkOpenAssetCircuitDependency(asset)} typeStore={asset.typeStore} openCircuitCallback={openAssetCallback} deleteCircuitCallback={deleteAssetCallback}/>
                {/if}
            {/each}
        {/if}
    </div>
</Panel>
