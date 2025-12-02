export interface IState {
    resetState(): Promise<void>;
    calculateState(): Promise<void>;
    propagateState(): Promise<boolean>;
}

export interface IBinaryState {
    enabled(): boolean;
    enable(): Promise<void>;
    disable(): Promise<void>;
}
