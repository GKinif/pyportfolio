export const updateSearchParams = (
  key: string,
  value: string,
  currentParams = ""
) => {
  const searchParams = new URLSearchParams(currentParams);
  searchParams.set(key, value);
  return "?" + searchParams.toString();
};
