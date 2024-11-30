import { AudioManager, Player } from "react-native-audio-playback";

import { getSoundsStoreState, soundsStoreActions } from "@/stores";

export function setupAudipStream() {
  AudioManager.shared.setupAudioStream();
}

export function openAudioStream() {
  AudioManager.shared.openAudioStream();
}

let backgroundPlayer: Player | undefined;
let beepPlayer: Player | undefined;
let buttonClickPlayer: Player | undefined;
let laserShotPlayer: Player | undefined;

soundsStoreActions.setSoundsCount(4);

export function loadSounds() {
  AudioManager.shared
    .loadSound(require("@/assets/sounds/bg-music1.mp3"))
    .then((player) => {
      console.log("player", player);
      if (player instanceof Player) {
        backgroundPlayer = player;
        soundsStoreActions.incrementSoundsCount();
      }
    });
  AudioManager.shared
    .loadSound(require("@/assets/sounds/beep.mp3"))
    .then((player) => {
      console.log("player", player);
      if (player instanceof Player) {
        beepPlayer = player;
        soundsStoreActions.incrementSoundsCount();
      }
    });
  AudioManager.shared
    .loadSound(require("@/assets/sounds/button-click1.mp3"))
    .then((player) => {
      console.log("player", player);
      if (player instanceof Player) {
        buttonClickPlayer = player;
        soundsStoreActions.incrementSoundsCount();
      }
    });
  AudioManager.shared
    .loadSound(require("@/assets/sounds/laser-shot.mp3"))
    .then((player) => {
      console.log("player", player);
      if (player instanceof Player) {
        laserShotPlayer = player;
        soundsStoreActions.incrementSoundsCount();
      }
    });
}

export function playBackgroundMusic() {
  if (
    getSoundsStoreState().preferences.isBackgroundMusicEnabled &&
    backgroundPlayer
  ) {
    backgroundPlayer.loopSound(true);
    backgroundPlayer.playSound();
  }
}

export function stopBackgroundMusic() {
  if (backgroundPlayer) {
    backgroundPlayer.pauseSound();
  }
}

export function setBackgroundMusicVolume(volume: number) {
  if (backgroundPlayer) {
    backgroundPlayer.setVolume(volume);
  }
}

export function playButtonClickSound() {
  if (
    getSoundsStoreState().preferences.isSoundEffectsEnabled &&
    buttonClickPlayer
  ) {
    buttonClickPlayer.playSound();
  }
}

export function playBeepSound() {
  if (getSoundsStoreState().preferences.isSoundEffectsEnabled && beepPlayer) {
    beepPlayer.playSound();
  }
}

export function loopLaserShotSound(value: boolean) {
  if (
    getSoundsStoreState().preferences.isSoundEffectsEnabled &&
    laserShotPlayer
  ) {
    laserShotPlayer.loopSound(value);
  }
}

export function playLaserShotSound() {
  if (
    getSoundsStoreState().preferences.isSoundEffectsEnabled &&
    laserShotPlayer
  ) {
    laserShotPlayer.playSound();
  }
}

export function setSoundEffectsVolume(volume: number) {
  if (beepPlayer) {
    beepPlayer.setVolume(volume);
  }
  if (buttonClickPlayer) {
    buttonClickPlayer.setVolume(volume);
  }
  if (laserShotPlayer) {
    laserShotPlayer.setVolume(volume);
  }
}
