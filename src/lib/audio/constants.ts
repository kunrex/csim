import type { AudioFile } from "$lib/audio/audio";

import Gate from "$lib/assets/SFX/gate.mp3";
import Wire from "$lib/assets/SFX/wire.mp3";
import Click from "$lib/assets/SFX/click.mp3";
import Error from "$lib/assets/SFX/error.mp3";
import Clear from "$lib/assets/SFX/clear.mp3";
import Delete from "$lib/assets/SFX/delete.mp3";
import Overlay from "$lib/assets/SFX/overlay.mp3";
import Confirm from "$lib/assets/SFX/confirm.mp3";
import Notification from "$lib/assets/SFX/notification.mp3";

export const AudioMap: Record<AudioFile, string> = {
    "gate": Gate,
    "wire": Wire,
    "click": Click,
    "error": Error,
    "clear": Clear,
    "delete": Delete,
    "overlay": Overlay,
    "confirm": Confirm,
    "notification": Notification,
};
