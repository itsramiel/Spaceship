import { SharedValue, useDerivedValue } from "react-native-reanimated";
import {
  Picture,
  Skia,
  createPicture,
  useImage,
} from "@shopify/react-native-skia";
import { TEnemy } from "../../../types";

interface EnemiesProps {
  enemies: SharedValue<Array<TEnemy>>;
}

export function Enemies({ enemies }: EnemiesProps) {
  const { image: enemy1Image, size: enemy1Size } = {
    image: useImage(require("../../../../assets/enemy1.png")),
    size: 480,
  };
  const { image: enemy2Image, size: enemy2Size } = {
    image: useImage(require("../../../../assets/enemy2.png")),
    size: 480,
  };
  const { image: enemy3Image, size: enemy3Size } = {
    image: useImage(require("../../../../assets/enemy3.png")),
    size: 480,
  };
  const { image: enemy4Image, size: enemy4Size } = {
    image: useImage(require("../../../../assets/enemy4.png")),
    size: 478,
  };

  const picture = useDerivedValue(() => {
    return createPicture((canvas) => {
      if (!enemy1Image || !enemy2Image || !enemy3Image || !enemy4Image) return;
      const paint = Skia.Paint();

      for (const enemy of enemies.value) {
        const enemyImage = (() => {
          switch (enemy.type) {
            case 0:
              return enemy1Image;
            case 1:
              return enemy2Image;
            case 2:
              return enemy3Image;
            default:
              return enemy4Image;
          }
        })();
        const enemySize = (() => {
          switch (enemy.type) {
            case 0:
              return enemy1Size;
            case 1:
              return enemy2Size;
            case 2:
              return enemy3Size;
            default:
              return enemy4Size;
          }
        })();
        const srcRect = Skia.XYWHRect(0, 0, enemySize, enemySize);
        const destRect = Skia.XYWHRect(
          enemy.x,
          enemy.y,
          enemy.size,
          enemy.size,
        );
        canvas.drawImageRect(enemyImage, srcRect, destRect, paint);
      }
    });
  }, [enemy1Image, enemy2Image, enemy3Image, enemy4Image]);

  return <Picture picture={picture} />;
}
