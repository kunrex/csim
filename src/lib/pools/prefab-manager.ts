import { PrefabData } from "$lib/logic";

export class PrefabManager {
    public static instance: PrefabManager;

    private readonly prefabs = new Map<string, PrefabData>();

    private constructor() {

    }

    public getPrefab(name: string): PrefabData | undefined {
        return this.prefabs.get(name);
    }

    public setPrefab(prefabData: PrefabData): void {
        this.prefabs.set(prefabData.name, prefabData);
    }

    public initPrefab(prefabData: PrefabData): void {

    }

    public initPrefabEdit(prefabData: PrefabData): void {

    }
}