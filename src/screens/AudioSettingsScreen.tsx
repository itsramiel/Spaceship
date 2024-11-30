import {
  playBackgroundMusic,
  setBackgroundMusicVolume,
  setSoundEffectsVolume,
  stopBackgroundMusic,
} from "@/audio";
import { COLORS } from "@/config";
import { Slider, Switch } from "@/components";
import { preferencesStoreActions, usePreferencesStore } from "@/stores";

import {
  createStyleSheet,
  UnistylesRuntime,
  useStyles,
} from "react-native-unistyles";
import { Text, View } from "react-native";

export function AudioSettingsScreen() {
  const { styles } = useStyles(stylesheet);
  const {
    isBackgroundMusicEnabled,
    soundEffectsVolume,
    isSoundEffectsEnabled,
    backgroundMusicVolume,
  } = usePreferencesStore((store) => store.state);

  const onBackgroundMusicSwitchChange = () => {
    if (isBackgroundMusicEnabled) {
      stopBackgroundMusic();
      usePreferencesStore.getState().actions.setBackgroundMusicEnabled(false);
    } else {
      usePreferencesStore.getState().actions.setBackgroundMusicEnabled(true);
      playBackgroundMusic();
    }
  };

  const onBackgroundMusicSliderChange = (value: number) => {
    setBackgroundMusicVolume(value);
    preferencesStoreActions.setBackgroundMusicVolume(value);
  };

  const onSoundEffectsSwitchChange = () => {
    preferencesStoreActions.setSoundEffectsEnabled(!isSoundEffectsEnabled);
  };

  const onSoundEffectsSliderChange = (value: number) => {
    setSoundEffectsVolume(value);
    preferencesStoreActions.setSoundEffectsVolume(value);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.contentContainer}>
        <AudioSetting
          title="Background Music"
          onSwitchChange={onBackgroundMusicSwitchChange}
          onSliderChange={onBackgroundMusicSliderChange}
          switchValue={isBackgroundMusicEnabled}
          sliderValue={backgroundMusicVolume}
        />
        <View style={styles.seperator} />
        <AudioSetting
          title="Sound Effects"
          onSwitchChange={onSoundEffectsSwitchChange}
          onSliderChange={onSoundEffectsSliderChange}
          switchValue={isSoundEffectsEnabled}
          sliderValue={soundEffectsVolume}
        />
      </View>
    </View>
  );
}

interface AudioSettingProps {
  title: string;
  switchValue: boolean;
  sliderValue: number;
  onSwitchChange: () => void;
  onSliderChange: (value: number) => void;
}

function AudioSetting({
  title,
  onSwitchChange,
  onSliderChange,
  sliderValue,
  switchValue,
}: AudioSettingProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.audioSettingContainer}>
      <View style={styles.audioSettingRow1}>
        <Text style={styles.audioSettingTitle}>{title}</Text>
        <Switch value={switchValue} onPress={onSwitchChange} />
      </View>
      <Slider
        minValue={0}
        maxValue={1}
        initialValue={sliderValue}
        onChange={onSliderChange}
      />
    </View>
  );
}

const stylesheet = createStyleSheet(() => ({
  screen: {
    paddingTop: 16,
    paddingBottom: Math.max(UnistylesRuntime.insets.bottom, 48),
    paddingHorizontal: Math.max(
      UnistylesRuntime.insets.left,
      UnistylesRuntime.insets.right,
      48,
    ),
    backgroundColor: COLORS["neutral/950"],
    flex: 1,
    alignItems: "center",
  },
  contentContainer: {
    width: "75%",
    borderWidth: 2,
    borderColor: COLORS["neutral/800"],
  },
  audioSettingContainer: {
    gap: 36,
    padding: 24,
  },
  seperator: {
    height: 2,
    backgroundColor: COLORS["neutral/800"],
  },
  audioSettingRow1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  audioSettingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
  },
}));
