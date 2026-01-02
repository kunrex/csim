import { PromptOverlay, LoadingOverlay, MessageOverlay, SettingsOverlay, NotificationOverlay, ConfirmationOverlay } from "$lib/overlays/components";
export { PromptOverlay, LoadingOverlay, MessageOverlay, SettingsOverlay, NotificationOverlay, ConfirmationOverlay };

import { settingsOverlay, notificationOverlay, messageOverlay, loadingOverlay, confirmationOverlay, promptOverlay, type IOverlayController, type LoadingControllerParams, type TitleMessageParams, type OverlayControllerResult } from "$lib/overlays/controllers";
export type { LoadingControllerParams, TitleMessageParams, OverlayControllerResult };

const settingsExport = settingsOverlay as IOverlayController<null, void>;
const notificationExport = notificationOverlay as IOverlayController<string, void>;
const messageExport = messageOverlay as IOverlayController<TitleMessageParams, void>;
const loadingExport = loadingOverlay as IOverlayController<LoadingControllerParams, void>;
const confirmationExport = confirmationOverlay as IOverlayController<TitleMessageParams, boolean>;
const promptExport = promptOverlay as IOverlayController<TitleMessageParams, OverlayControllerResult>;

export { settingsExport as settingsOverlay, notificationExport as notificationOverlay, messageExport as messageOverlay, loadingExport as loadingOverlay, confirmationExport as confirmationOverlay, promptExport as promptOverlay };
