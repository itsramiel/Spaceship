import {
  BlurStyle,
  PaintStyle,
  Picture,
  SkPoint,
  Skia,
  StrokeCap,
  createPicture,
} from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { PRIMARY_COLOR, SHOT_LENGTH, SHOT_STROKE_WIDTH } from "../config";

interface ShotProps {
  shots: SharedValue<Array<SkPoint>>;
}

export function Shots({ shots }: ShotProps) {
  const picture = useDerivedValue(() => {
    return createPicture((canvas) => {
      const glowPaint = Skia.Paint();
      glowPaint.setStyle(PaintStyle.Stroke);
      glowPaint.setStrokeWidth(SHOT_STROKE_WIDTH);
      glowPaint.setColor(Skia.Color(PRIMARY_COLOR));
      glowPaint.setStrokeCap(StrokeCap.Round);

      // Apply a blur effect
      const blurRadius = 3; // Adjust the radius as needed
      const blurFilter = Skia.MaskFilter.MakeBlur(
        BlurStyle.Normal,
        blurRadius,
        true,
      );
      glowPaint.setMaskFilter(blurFilter);

      const shotPaint = Skia.Paint();
      shotPaint.setStyle(PaintStyle.Stroke);
      shotPaint.setStrokeWidth(SHOT_STROKE_WIDTH / 2);
      shotPaint.setColor(Skia.Color("white"));
      shotPaint.setStrokeCap(StrokeCap.Round);

      for (const shot of shots.value) {
        const y = shot.y;
        canvas.drawLine(shot.x, y, shot.x + SHOT_LENGTH, y, glowPaint);
        canvas.drawLine(shot.x, y, shot.x + SHOT_LENGTH, y, shotPaint);
      }
    });
  });

  return <Picture picture={picture} />;
}
