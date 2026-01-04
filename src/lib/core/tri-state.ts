export enum TriState {
    Low = 0,
    High = 1,
    Unknown = -1,
}

export interface TriStateObject {
    get objectState() : TriState;

    propagateLow() : Promise<void>;
    propagateHigh() : Promise<void>;
    propagateUnknown() : Promise<void>;
}

export const invert: Record<TriState, TriState> = {
    [TriState.Low]: TriState.High,
    [TriState.High]: TriState.Low,
    [TriState.Unknown]: TriState.Unknown,
};

export function fromBoolean (value: boolean) : TriState {
    return value ? TriState.High : TriState.Low;
}

export function propagateObjectState(from: TriStateObject, to: TriStateObject) : Promise<void> {
    switch (from.objectState) {
        case TriState.Low:
            return to.propagateLow();
        case TriState.High:
            return to.propagateHigh();
        default:
            return to.propagateUnknown();
    }
}
