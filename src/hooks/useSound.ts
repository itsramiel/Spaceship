import { useEffect, useState } from "react";
import { Audio, AVPlaybackSource } from "expo-av";

export function useSound(source: AVPlaybackSource) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    Audio.Sound.createAsync(source).then(async ({ sound }) => {
      setSound(sound);
    });

    return () => {
      sound?.unloadAsync();
    };
  }, []);

  return sound;
}
