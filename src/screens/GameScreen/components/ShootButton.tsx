import {
  Blur,
  Circle,
  Group,
  Line,
  Path,
  SkPath,
  SkPoint,
  Skia,
  Transforms3d,
} from "@shopify/react-native-skia";

import {
  BUTTON_STROKE_OPACITY,
  BUTTON_STROKE_WIDTH,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TERTIARY_COLOR,
  CONTINUOUS_SHOOTING_RATE,
} from "../../../config";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import React from "react";

const INNER_CIRCLE_RATIO = 0.2;
const OUTTER_CIRCLE_RATIO = 0.45;

const LINE_LENGTH_RATIO = 0.25;

interface ShootButtonProps {
  size: SharedValue<number>;
  continuousShootingRate: SharedValue<number>;
}

export function ShootButton({
  size,
  continuousShootingRate,
}: ShootButtonProps) {
  const radius = useDerivedValue(() => {
    return size.value / 2;
  }, []);

  const innerCircleRadius = useDerivedValue(() => {
    return radius.value * INNER_CIRCLE_RATIO;
  }, []);

  const outterCircleRadius = useDerivedValue(() => {
    return radius.value * OUTTER_CIRCLE_RATIO;
  }, []);

  const lineLength = useDerivedValue(() => {
    return 2 * outterCircleRadius.value * LINE_LENGTH_RATIO;
  }, []);

  const p1 = useDerivedValue((): SkPoint => {
    return {
      x: 0,
      y: -lineLength.value / 2,
    };
  }, []);

  const p2 = useDerivedValue((): SkPoint => {
    return {
      x: 0,
      y: lineLength.value / 2,
    };
  }, []);

  const lineTransform = Array.from({ length: 4 }).map(
    (_, i) =>
      useDerivedValue((): Transforms3d => {
        const isEven = i % 2 === 0;
        const translationValue =
          (i === 0 || i === 1 ? -1 : 1) * outterCircleRadius.value;
        const translation = isEven
          ? { translateY: translationValue }
          : { translateX: translationValue };
        return [
          translation,
          {
            rotate: isEven ? 0 : Math.PI / 2,
          },
        ];
      }, []),
    [],
  );

  const shootingRateCirclePath = useDerivedValue((): SkPath => {
    const path = Skia.Path.Make();
    path.addCircle(0, 0, radius.value);

    return path;
  });

  const strokeProgess = useDerivedValue(() => {
    return 1 - continuousShootingRate.value / CONTINUOUS_SHOOTING_RATE;
  }, []);

  return (
    <>
      <Circle cx={0} cy={0} r={radius} color={SECONDARY_COLOR} />
      <Path
        path={shootingRateCirclePath}
        style={"stroke"}
        color={TERTIARY_COLOR}
        strokeWidth={BUTTON_STROKE_WIDTH}
        opacity={BUTTON_STROKE_OPACITY}
      />
      <Group transform={[{ rotate: -Math.PI / 2 }]}>
        <Path
          start={strokeProgess}
          end={1}
          path={shootingRateCirclePath}
          style={"stroke"}
          color={PRIMARY_COLOR}
          strokeWidth={BUTTON_STROKE_WIDTH}
        >
          <Blur blur={3} />
        </Path>
        <Path
          start={strokeProgess}
          end={1}
          path={shootingRateCirclePath}
          style={"stroke"}
          color={"white"}
          strokeWidth={BUTTON_STROKE_WIDTH / 2}
        />
      </Group>
      <Circle
        cx={0}
        cy={0}
        r={innerCircleRadius}
        style={"stroke"}
        color={TERTIARY_COLOR}
        strokeWidth={BUTTON_STROKE_WIDTH}
      />
      <Circle
        cx={0}
        cy={0}
        r={outterCircleRadius}
        style={"stroke"}
        color={TERTIARY_COLOR}
        strokeWidth={BUTTON_STROKE_WIDTH}
      />
      {Array.from({ length: 4 }).map((_, index) => (
        <Line
          key={index}
          p1={p1}
          p2={p2}
          strokeWidth={BUTTON_STROKE_WIDTH}
          color={TERTIARY_COLOR}
          strokeCap={"round"}
          transform={lineTransform[index]}
        />
      ))}
    </>
  );
}
