export function getOrderedBlogMedia(media = []) {
  if (!Array.isArray(media) || media.length === 0) {
    return [];
  }

  const items = media.filter(Boolean);
  const coverIndex = items.findIndex((item) => item?.isCover);

  if (coverIndex <= 0) {
    return items;
  }

  const ordered = [...items];
  const [coverItem] = ordered.splice(coverIndex, 1);
  ordered.unshift(coverItem);
  return ordered;
}

export function getPrimaryBlogMedia(media = []) {
  return getOrderedBlogMedia(media)[0] || null;
}
