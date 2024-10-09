import {
  BlendColor,
  Blur,
  Circle,
  Group,
  ImageSVG,
  Paint,
  Path,
  Skia,
  Transforms3d,
  useSVG,
} from '@shopify/react-native-skia';
import {SharedValue, useDerivedValue} from 'react-native-reanimated';
import {
  BUTTON_STROKE_OPACITY,
  BUTTON_STROKE_WIDTH,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TERTIARY_COLOR,
} from '../theme';

const PARTIAL_CIRCLE_RATIO = 1 / 6;

const ICONS_SIZE_RATIO = 0.1;

const FINGERPRINT_SIZE_RATIO = 0.35;

const INNER_CIRCLE_PADDING_RATIO = 0.05;

interface JoystickProps {
  size: SharedValue<number>;
}

export function Joystick({size}: JoystickProps) {
  const image = useSVG(require('../../assets/fingerprint.svg'));
  const chevronUp = useSVG(require('../../assets/chevron-up-outline.svg'));

  const imageSize = useDerivedValue(() => {
    return size.value * FINGERPRINT_SIZE_RATIO;
  }, []);

  const imagePosition = useDerivedValue(() => {
    return -imageSize.value / 2;
  }, []);

  const iconSize = useDerivedValue(() => {
    return size.value * ICONS_SIZE_RATIO;
  }, []);

  const iconPosition = useDerivedValue(() => {
    return -iconSize.value / 2;
  }, []);

  const innerCirclePadding = useDerivedValue(() => {
    return size.value * INNER_CIRCLE_PADDING_RATIO;
  }, []);

  const innerCircleOuerCircleSpacing = useDerivedValue(() => {
    return (
      size.value / 2 -
      (BUTTON_STROKE_WIDTH / 2 +
        imageSize.value / 2 +
        innerCirclePadding.value +
        BUTTON_STROKE_WIDTH)
    );
  }, []);

  const path = useDerivedValue(() => {
    const path = Skia.Path.Make();
    path.addCircle(
      0,
      0,
      imageSize.value / 2 + innerCirclePadding.value + BUTTON_STROKE_WIDTH / 2,
    );
    return path;
  }, []);

  const outerCircleRadius = useDerivedValue(() => {
    return size.value / 2;
  }, []);

  const outerCircleStrokeRadius = useDerivedValue(() => {
    return size.value / 2 + BUTTON_STROKE_WIDTH / 2;
  }, []);

  const innerCircleRadius = useDerivedValue(() => {
    return (
      imageSize.value / 2 + innerCirclePadding.value + BUTTON_STROKE_WIDTH / 2
    );
  }, []);

  const iconsTransformations = Array.from({length: 4}).map((_, i) =>
    useDerivedValue((): Transforms3d => {
      const isEven = i % 2 === 0;
      const translationValue =
        (i === 0 || i === 3 ? -1 : 1) *
        (imageSize.value / 2 +
          innerCirclePadding.value +
          BUTTON_STROKE_WIDTH +
          innerCircleOuerCircleSpacing.value / 2);

      const rotation = {rotate: i * (Math.PI / 2)};

      return [
        isEven
          ? {translateY: translationValue}
          : {translateX: translationValue},
        rotation,
      ];
    }, []),
  );

  if (!image || !chevronUp) return null;

  return (
    <>
      <Circle cx={0} cy={0} r={outerCircleRadius} color={SECONDARY_COLOR} />
      <Circle
        cx={0}
        cy={0}
        r={outerCircleStrokeRadius}
        strokeWidth={BUTTON_STROKE_WIDTH}
        color={TERTIARY_COLOR}
        style="stroke"
        opacity={BUTTON_STROKE_WIDTH}
      />
      <Group
        layer={
          <Paint>
            <BlendColor color={TERTIARY_COLOR} mode="srcIn" />
          </Paint>
        }>
        <ImageSVG
          svg={image}
          width={imageSize}
          height={imageSize}
          x={imagePosition}
          y={imagePosition}
        />
      </Group>
      <Circle
        cx={0}
        cy={0}
        r={innerCircleRadius}
        strokeWidth={BUTTON_STROKE_WIDTH}
        color={TERTIARY_COLOR}
        style="stroke"
        opacity={BUTTON_STROKE_OPACITY}
      />
      {Array.from({length: 4}).map((_, index) => {
        return (
          <Group
            transform={[
              {
                rotate:
                  -(PARTIAL_CIRCLE_RATIO / 2) * 2 * Math.PI +
                  index * (Math.PI / 2),
              },
            ]}
            key={index}>
            <Path
              path={path}
              start={0}
              end={PARTIAL_CIRCLE_RATIO}
              color={PRIMARY_COLOR}
              strokeCap={'round'}
              style="stroke"
              strokeWidth={2 * BUTTON_STROKE_WIDTH}>
              <Blur blur={3} />
            </Path>
            <Path
              path={path}
              start={0}
              end={PARTIAL_CIRCLE_RATIO}
              color={'white'}
              strokeCap={'round'}
              style="stroke"
              strokeWidth={BUTTON_STROKE_WIDTH / 2}
            />
          </Group>
        );
      })}
      <Group
        layer={
          <Paint>
            <BlendColor color={'white'} mode="srcIn" />
          </Paint>
        }>
        {Array.from({length: 4}).map((_, index) => {
          return (
            <Group transform={iconsTransformations[index]} key={index}>
              <ImageSVG
                svg={chevronUp}
                width={iconSize}
                height={iconSize}
                x={iconPosition}
                y={iconPosition}
              />
            </Group>
          );
        })}
      </Group>
    </>
  );
}
