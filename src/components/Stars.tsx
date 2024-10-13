import {
  SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useFrameCallback,
} from "react-native-reanimated";
import { Skia, createPicture, Picture } from "@shopify/react-native-skia";
import { useSharedValues } from "./SharedValuesProvider";

type TStar = {
  x: number;
  y: number;
  size: number;
};

const STAR_SIZE_MAX_SIZE = 4;

function isOutOfBounds(star: TStar) {
  "worklet";
  return star.x < -star.size / 2;
}

const STARS_SPEED = 1 / 160; // 1 point per 160 milliseconds

interface StarsProps {
  stars: SharedValue<Array<TStar>>;
}

export function Stars({ stars }: StarsProps) {
  const { gameInfo, canvasSize } = useSharedValues();

  useFrameCallback((frameInfo) => {
    if (!frameInfo.timeSincePreviousFrame || !gameInfo.value.isPlaying) return;
    const timeSincePreviousFrame = frameInfo.timeSincePreviousFrame;

    stars.value = stars.value.map((star) => {
      if (isOutOfBounds(star)) {
        return {
          x: canvasSize.value.width + star.size / 2,
          y:
            star.size / 2 +
            Math.random() * (canvasSize.value.width - star.size / 2),
          size: star.size,
        };
      } else {
        star.x -= timeSincePreviousFrame * STARS_SPEED;
        return star;
      }
    });
  });

  useAnimatedReaction(
    () => {
      return canvasSize.value;
    },
    () => {
      const starNumber = 250;

      stars.value = Array.from({ length: starNumber }).map(() => {
        const x = Math.random() * canvasSize.value.width;
        const y = Math.random() * canvasSize.value.height;
        const starSize = Math.random() * (STAR_SIZE_MAX_SIZE - 1) + 1;

        return { x, y, size: starSize };
      });
    },
  );

  const picture = useDerivedValue(
    () =>
      createPicture((canvas) => {
        const paint = Skia.Paint();
        paint.setColor(Skia.Color("white"));

        for (const star of stars.value) {
          canvas.drawCircle(star.x, star.y, star.size, paint);
        }
      }),
    [],
  );

  return <Picture picture={picture} />;
}
