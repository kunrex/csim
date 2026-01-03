import { OverlayController } from "$lib/overlays/controllers/controller";

export interface LoadingControllerParams {
    title: string,
    action: Promise<void>
}

export interface TitleMessageParams {
    title: string,
    message: string
}

export interface PromptMessageParams extends TitleMessageParams {
    placeholder?: string,
}

export interface OverlayControllerResult {
    value: string,
    result: boolean
}

export const settingsOverlay = new OverlayController<null, void>();
export const notificationOverlay = new OverlayController<string, void>();
export const messageOverlay = new OverlayController<TitleMessageParams, void>();
export const loadingOverlay = new OverlayController<LoadingControllerParams, void>();
export const confirmationOverlay = new OverlayController<TitleMessageParams, boolean>();
export const promptOverlay = new OverlayController<PromptMessageParams, OverlayControllerResult>();
