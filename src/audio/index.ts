import { AudioManager, Player } from "react-native-audio-playback";

import { getPreferencesStoreState } from "@/stores";

export function setupAudipStream() {
  AudioManager.shared.setupAudioStream();
}

export function openAudioStream() {
  AudioManager.shared.openAudioStream();
}

let backgroundPlayer: { player: Player | undefined } = { player: undefined };
let beepPlayer: { player: Player | undefined } = { player: undefined };
let buttonClickPlayer: { player: Player | undefined } = { player: undefined };
let laserShotPlayer: { player: Player | undefined } = { player: undefined };

export function loadSounds(onProgressChange: (progress: number) => void) {
  const data = [
    [require("@/assets/sounds/bg-music1.mp3"), backgroundPlayer],
    [require("@/assets/sounds/beep.mp3"), beepPlayer],
    [require("@/assets/sounds/button-click1.mp3"), buttonClickPlayer],
    [require("@/assets/sounds/laser-shot.mp3"), laserShotPlayer],
  ] as const;

  let loadedSoundsCount = 0;
  const soundsCount = data.length;

  for (let [asset, player] of data) {
    AudioManager.shared.loadSound(asset).then((loadedPlayer) => {
      if (loadedPlayer instanceof Player) {
        player.player = loadedPlayer;
        loadedSoundsCount++;
        onProgressChange(loadedSoundsCount / soundsCount);
      }
    });
  }
}

export function setupBackgroundMusic() {
  if (backgroundPlayer.player) {
    backgroundPlayer.player.loopSound(true);
    backgroundPlayer.player.setVolume(
      getPreferencesStoreState().backgroundMusicVolume,
    );
  }
}

export function playBackgroundMusic() {
  if (
    getPreferencesStoreState().isBackgroundMusicEnabled &&
    backgroundPlayer.player
  ) {
    backgroundPlayer.player.playSound();
  }
}

export function stopBackgroundMusic() {
  if (backgroundPlayer.player) {
    backgroundPlayer.player.pauseSound();
  }
}

export function setBackgroundMusicVolume(volume: number) {
  if (backgroundPlayer.player) {
    backgroundPlayer.player.setVolume(volume);
  }
}

export function setupSoundEffects() {
  const players = [
    beepPlayer.player,
    buttonClickPlayer.player,
    laserShotPlayer.player,
  ].filter((player) => player) as Array<Player>;

  const volume = getPreferencesStoreState().soundEffectsVolume;
  AudioManager.shared.setSoundsVolume(
    players.map((player) => [player, volume] as const),
  );

  if (beepPlayer.player) {
    beepPlayer.player.setVolume(getPreferencesStoreState().soundEffectsVolume);
  }
  if (buttonClickPlayer.player) {
    buttonClickPlayer.player.setVolume(
      getPreferencesStoreState().soundEffectsVolume,
    );
  }
  if (laserShotPlayer.player) {
    laserShotPlayer.player.setVolume(
      getPreferencesStoreState().soundEffectsVolume,
    );
  }
}

export function playButtonClickSound() {
  if (
    getPreferencesStoreState().isSoundEffectsEnabled &&
    buttonClickPlayer.player
  ) {
    buttonClickPlayer.player.playSound();
  }
}

export function playBeepSound() {
  if (getPreferencesStoreState().isSoundEffectsEnabled && beepPlayer.player) {
    beepPlayer.player.playSound();
  }
}

export function loopLaserShotSound(value: boolean) {
  if (
    getPreferencesStoreState().isSoundEffectsEnabled &&
    laserShotPlayer.player
  ) {
    laserShotPlayer.player.loopSound(value);
  }
}

export function playLaserShotSound() {
  if (
    getPreferencesStoreState().isSoundEffectsEnabled &&
    laserShotPlayer.player
  ) {
    laserShotPlayer.player.playSound();
  }
}

export function setSoundEffectsVolume(volume: number) {
  if (beepPlayer.player) {
    beepPlayer.player.setVolume(volume);
  }
  if (buttonClickPlayer.player) {
    buttonClickPlayer.player.setVolume(volume);
  }
  if (laserShotPlayer.player) {
    laserShotPlayer.player.setVolume(volume);
  }
}
