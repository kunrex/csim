import { MessageOverlay, LoadingOverlay, TextInputOverlay, NotificationOverlay, ConfirmationOverlay, SimulationSettingsOverlay } from "$lib/overlays/components";
export { MessageOverlay, LoadingOverlay, TextInputOverlay, NotificationOverlay, ConfirmationOverlay, SimulationSettingsOverlay };

import type { LoadingControllerParams, TitleMessageParams, OverlayControllerResult } from "$lib/overlays/controllers";
import { messageController, loadingController, textInputController, simulationSettingsController, confirmationController, notificationController } from "$lib/overlays/controllers";
import type { IOverlayController } from "$lib/overlays/controllers/controller";

const notificationControllerExport = notificationController as IOverlayController<string, void>;
const messageControllerExport = messageController as IOverlayController<TitleMessageParams, void>;
const loadingControllerExport = loadingController as IOverlayController<LoadingControllerParams, void>;
const simulationSettingsControllerExport = simulationSettingsController as IOverlayController<null, void>;
const confirmationControllerExport = confirmationController as IOverlayController<TitleMessageParams, boolean>;
const prefabNameControllerExport = textInputController as IOverlayController<TitleMessageParams, OverlayControllerResult>;

export { messageControllerExport as messageController, loadingControllerExport as loadingController, simulationSettingsControllerExport as simulationSettingsController, prefabNameControllerExport as prefabNameController, confirmationControllerExport as confirmationController, notificationControllerExport as notificationController, type LoadingControllerParams, type TitleMessageParams };
