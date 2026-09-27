export function naturalPhotoFrameClass(className = "") {
  return className
    .split(/\s+/)
    .filter(Boolean)
    .filter((part) => !/(^|:)aspect-(?:\[[^\]]+\]|square|video)$/.test(part))
    .join(" ");
}