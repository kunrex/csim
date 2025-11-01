export interface IEnable {
    enable(): Promise<void>;
    disable(): Promise<void>;
    enabled(): boolean;
}