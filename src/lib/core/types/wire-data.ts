export interface WireData {
    state: boolean,

    [key: string]: unknown
}

export type UpdateWireSignature = (id: string, gateData: WireData) => void;
