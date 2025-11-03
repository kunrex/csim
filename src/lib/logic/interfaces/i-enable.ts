export interface IEnable {
    enable(): Promise<void>;
    disable(): Promise<void>;
    reset(): Promise<void>;
    enabled(): boolean;
}