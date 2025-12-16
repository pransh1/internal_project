export const formatLabel = (value) => {
  if (!value || typeof value !== "string") return "";

  return value
    .toLowerCase()
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
