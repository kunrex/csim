import { playAudio } from "$lib/audio";
import {notificationOverlay, promptOverlay, type TitleMessageParams} from "$lib/overlays";

export async function notify(notification: string) : Promise<void> {
    await Promise.allSettled([
        playAudio("notification"),
        notificationOverlay.open(notification)
    ]);
}

export async function prompt(params: TitleMessageParams) : Promise<string | null> {
    const result = await Promise.allSettled([
        playAudio("overlay"),
        promptOverlay.open(params)
    ]);

    const prompt = result[1];
    if(prompt.status == "rejected" || !prompt.value.result)
        return null;

    return prompt.value.value;
}
