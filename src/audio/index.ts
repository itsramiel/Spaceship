import { AudioManager, Player } from "react-native-audio-playback";

AudioManager.shared.setupAudioStream();
AudioManager.shared.openAudioStream();

let _backgroundPlayer: Player | undefined;
let _buttonClickPlayer: Player | undefined;
let _beepPlayer: Player | undefined;
let _laserShotPlayer: Player | undefined;

export const audioPlayers = {
  get backgroundPlayer() {
    return _backgroundPlayer;
  },
  get buttonClickPlayer() {
    return _buttonClickPlayer;
  },
  get beepPlayer() {
    return _beepPlayer;
  },
  get laserShotPlayer() {
    return _laserShotPlayer;
  },
};

AudioManager.shared
  .loadSound(require("@/assets/sounds/bg-music1.mp3"))
  .then((player) => {
    if (player instanceof Player) {
      _backgroundPlayer = player;
      player.loopSound(true);
      player.playSound();
    }
  });

AudioManager.shared
  .loadSound(require("@/assets/sounds/button-click1.mp3"))
  .then((player) => {
    if (player instanceof Player) {
      _buttonClickPlayer = player;
    }
  });

AudioManager.shared
  .loadSound(require("@/assets/sounds/beep.mp3"))
  .then((player) => {
    if (player instanceof Player) {
      _beepPlayer = player;
    }
  });

AudioManager.shared
  .loadSound(require("@/assets/sounds/laser-shot.mp3"))
  .then((player) => {
    if (player instanceof Player) {
      _laserShotPlayer = player;
    }
  });

// (async () => {
//   const bgPlayer = await AudioManager.shared.loadSound(
//     require("@/assets/sounds/bg-music1.mp3"),
//   );
//   if (bgPlayer instanceof Player) {
//     bgPlayer.loopSound(true);
//     bgPlayer.playSound();
//     _backgroundPlayer = bgPlayer;
//   }
//   console.log("bgPlayer", bgPlayer);
//
//   const buttonClickPlayer = await AudioManager.shared.loadSound(
//     require("@/assets/sounds/button-click1.mp3"),
//   );
//   if (buttonClickPlayer instanceof Player) {
//     _buttonClickPlayer = buttonClickPlayer;
//   }
//   console.log("buttonClickPlayer", buttonClickPlayer);
//
//   const beepPlayer = await AudioManager.shared.loadSound(
//     require("@/assets/sounds/beep.mp3"),
//   );
//   if (beepPlayer instanceof Player) {
//     _beepPlayer = beepPlayer;
//   }
//   console.log("beepPlayer", beepPlayer);
//
//   const lasetShotPlayer = await AudioManager.shared.loadSound(
//     require("@/assets/sounds/laser-shot.mp3"),
//   );
//   if (lasetShotPlayer instanceof Player) {
//     _laserShotPlayer = lasetShotPlayer;
//   }
//   console.log("lasetShotPlayer", lasetShotPlayer);
// })();
