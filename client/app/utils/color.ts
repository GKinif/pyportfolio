import Color from "color";

export const stringToColour = (
  str: string,
  minLightness = 50,
  maxLightness = 80,
  minSaturation = 10,
  maxSaturation = 80
): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const tmpColor = Color.hsl(
    hash % 360,
    (hash % (maxSaturation - minSaturation)) + minSaturation,
    (hash % (maxLightness - minLightness)) + minLightness
  );

  return tmpColor.hex();
};
