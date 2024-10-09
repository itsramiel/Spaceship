import {
  SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useFrameCallback,
} from 'react-native-reanimated';
import {Skia, createPicture, Picture} from '@shopify/react-native-skia';

type TStar = {
  x: number;
  y: number;
  size: number;
};

const STAR_SIZE_MAX_SIZE = 4;

function isOutOfBounds(star: TStar, canvas: {width: number; height: number}) {
  'worklet';
  return star.y - star.size / 2 > canvas.height;
}

const STARS_SPEED = 1 / 160; // 1 point per 160 milliseconds

interface StarsProps {
  stars: SharedValue<Array<TStar>>;
  canvasSize: SharedValue<{width: number; height: number}>;
}

export function Stars({stars, canvasSize}: StarsProps) {
  useFrameCallback(frameInfo => {
    if (!frameInfo.timeSincePreviousFrame) return;
    const timeSincePreviousFrame = frameInfo.timeSincePreviousFrame;

    stars.value = stars.value.map(star => {
      if (isOutOfBounds(star, canvasSize.value)) {
        return {
          x: Math.random() * canvasSize.value.width,
          y: 0,
          size: star.size,
        };
      } else {
        star.y += timeSincePreviousFrame * STARS_SPEED;
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

      stars.value = Array.from({length: starNumber}).map(() => {
        const x = Math.random() * canvasSize.value.width;
        const y = Math.random() * canvasSize.value.height;
        const starSize = Math.random() * (STAR_SIZE_MAX_SIZE - 1) + 1;

        return {x, y, size: starSize};
      });
    },
  );

  const picture = useDerivedValue(
    () =>
      createPicture(canvas => {
        const paint = Skia.Paint();
        paint.setColor(Skia.Color('white'));

        for (const star of stars.value) {
          canvas.drawCircle(star.x, star.y, star.size, paint);
        }
      }),
    [],
  );

  return <Picture picture={picture} />;
}
