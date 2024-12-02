import { AudioManager } from "react-native-audio-playback";
import { useCallbackOnForegrounded } from "./useCallbackOnForegrounded";
import { useCallbackOnBackgrounded } from "./useCalbackOnBackgrounded";

export function useAppLifecycleAudioManager() {
  useCallbackOnForegrounded(openAudioStream);
  useCallbackOnBackgrounded(pauseAudioStream);
}

function openAudioStream() {
  try {
    AudioManager.shared.openAudioStream();
  } catch (error) {
    console.error(error);
  }
}

function pauseAudioStream() {
  try {
    AudioManager.shared.pauseAudioStream();
  } catch (error) {
    console.error(error);
  }
}
