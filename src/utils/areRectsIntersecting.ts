import { SkRect } from "@shopify/react-native-skia";

export function areRectsIntersecting(rect1: SkRect, rect2: SkRect) {
  "worklet";
  const x11 = rect1.x;
  const y11 = rect1.y;
  const x12 = rect1.x + rect1.width;
  const y12 = rect1.y + rect1.height;

  const x21 = rect2.x;
  const y21 = rect2.y;
  const x22 = rect2.x + rect2.width;
  const y22 = rect2.y + rect2.height;

  const is1LeftOf2 = x12 < x21;
  const is1RightOf2 = x11 > x22;
  const is1Above2 = y12 < y21;
  const is1Below2 = y11 > y22;

  return !(is1LeftOf2 || is1RightOf2 || is1Above2 || is1Below2);
}
