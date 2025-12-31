<script lang="ts">
    import { Panel } from "@xyflow/svelte";

    import type { GateType, AssetGateType } from "$lib/core";

    import { nonIconGateTypes, iconGateTypes } from "$lib/flow/constants";

    import { AssetTypeStore } from "$lib/flow/types";

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
        assetType: AssetType
        typeStore: AssetTypeStore,
    }

    let { openAssetCallback, deleteAssetCallback } : AssetProps = $props();

    let window: AssetType = $state.raw("core");

    let assets: Asset[] = $state.raw([]);
    let openAsset: Asset | null = $state.raw(null);

    export function openAssetHandler(gateType: GateType) : AssetTypeStore | null {
        for(const asset of assets)
            if(asset.typeStore.gateType == gateType) {
                openAsset = asset;
                return asset.typeStore;
            }

        return null;
    }

    export function deleteAssetHandler(gateType: GateType) : void {
        assets = assets.filter(asset => asset.typeStore.gateType != gateType);
    }

    export function addAsset(gateType: AssetGateType, assetType: AssetType) : void {
        assets = [...assets, {
            assetType: assetType,
            typeStore: new AssetTypeStore(gateType)
        } satisfies Asset];
    }

    function checkOpenAssetDependency(asset: Asset) : boolean {
        if(openAsset == null)
            return false;

        return asset === openAsset || asset.typeStore.gateType.dependencies.has(openAsset.typeStore.gateType.id);
    }
</script>

<Panel class="flex flex-col h-auto w-1/2 absolute panel-background" position="bottom-right">
    <div class="flex flex-row justify-start absolute top-0 left-0 -translate-y-full px-2">
        <AssetWindow title="Core" onclick={() => { window = "core" }} selected={window === "core"}></AssetWindow>
        <AssetWindow title="Prefabs" onclick={() => { window = "prefabs" }} selected={window === "prefabs"}></AssetWindow>
        <AssetWindow title="Circuits" onclick={() => { window = "circuits" }} selected={window === "circuits"}></AssetWindow>
    </div>
    <div class="flex flex-row items-center min-h-16 w-full overflow-x-auto gap-x-4">
        {#if window === "core" }
            {#each nonIconGateTypes as type}
                <InstantiateGate type={type} color={`color-${type.name}`} />
            {/each}
            {#each iconGateTypes as type}
                <InstantiateGate type={type[0]} color={`color-${type[0].name}`} fabIcon={type[1]} />
            {/each}
        {:else if openAsset !== null }
            {#each assets as asset }
                {#if window === "circuits" && asset.assetType === window}
                    <OpenCircuit disabled={openAsset === asset} typeStore={asset.typeStore} openCircuitCallback={openAssetCallback} deleteCircuitCallback={deleteAssetCallback}/>
                {:else if asset.assetType === window}
                    <InstantiatePrefabGate disabled={checkOpenAssetDependency(asset)} deletable={asset !== openAsset} typeStore={asset.typeStore} openPrefabCallback={openAssetCallback} deletePrefabCallback={deleteAssetCallback} />
                {/if}
            {/each}
        {/if}
    </div>
</Panel>
