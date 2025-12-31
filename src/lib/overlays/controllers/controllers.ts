import { OverlayController } from "$lib/overlays/controllers/controller";

export interface LoadingControllerParams {
    title: string,
    action: Promise<void>
}

export interface TitleMessageParams {
    title: string,
    message: string
}

export interface OverlayControllerResult {
    value: string,
    result: boolean
}

export const simulationSettingsController = new OverlayController<null, void>();
export const messageController = new OverlayController<TitleMessageParams, void>();
export const loadingController = new OverlayController<LoadingControllerParams, void>();
export const confirmationController = new OverlayController<TitleMessageParams, boolean>();
export const textInputController = new OverlayController<TitleMessageParams, OverlayControllerResult>();
