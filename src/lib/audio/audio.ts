import { AudioMap } from "$lib/audio/constants";

export type AudioFile = "gate" | "wire" | "click" | "error" | "clear" | "delete"  | "confirm" | "overlay" | "notification";

function preLoadAudio(audio: AudioFile) : HTMLAudioElement {
    const audioElement = new Audio(AudioMap[audio]);
    audioElement.currentTime = 0;
    audioElement.loop = false;

    return audioElement;
}

let audioElements: Record<AudioFile, HTMLAudioElement>;

export function preLoadAudioFiles() : void {
    audioElements = {
        "gate": preLoadAudio("gate"),
        "wire": preLoadAudio("wire"),
        "click": preLoadAudio("click"),
        "error": preLoadAudio("error"),
        "clear": preLoadAudio("clear"),
        "delete": preLoadAudio("delete"),
        "overlay": preLoadAudio("overlay"),
        "confirm": preLoadAudio("confirm"),
        "notification": preLoadAudio("notification"),
    }
}

export function playAudio(audioFile: AudioFile) : Promise<void> {
    const audio = audioElements[audioFile];
    if(!audio)
        return Promise.resolve();

    if(!audio.paused) {
        audio.pause();
        audio.currentTime = 0
    }

    return audio.play();
}
