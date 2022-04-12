export const range = (min: number, max: number) => {
  return [...Array(max - min).keys()].map((i) => i + min);
};
