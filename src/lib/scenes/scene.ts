import {ConnectionData, CoreGateData, type GateNodeType} from "$lib/flow";

import { deleteGate, getConnectionHandles, EdgePool } from "$lib/pools";
import {Gate} from "$lib";

export class Scene {
    public constructor() { }

    public createGate(type: GateNodeType, gate: Gate) : void {
        //flow.createGate(type, gate);
        //gate.gateData["name"] = `Gate ${gate.id}`;
        //inspector.addGate(gate);
    }

    public async onDeleteGate(gate: CoreGateData) : Promise<void> {
        //inspector.removeGate(gate.id);
        await deleteGate(gate);
    }

    public async onConnection(connectionData: ConnectionData) : Promise<void> {
        const handles = getConnectionHandles(connectionData);
        if(!handles)
            return;

        await EdgePool.instance.createEdgeConnection(connectionData.id, handles[0], handles[1]);
    }

    public async onDisconnection(connectionData: ConnectionData) : Promise<void> {
        const nodes = getConnectionHandles(connectionData);
        if(!nodes)
            return;

        await EdgePool.instance.deleteEdgeConnection(connectionData.id, nodes[0], nodes[1]);
    }

    public async onReconnection(oldConnection: ConnectionData, newConnection: ConnectionData) : Promise<void> {
        await this.onDisconnection(oldConnection);
        await this.onConnection(newConnection);
    }
}