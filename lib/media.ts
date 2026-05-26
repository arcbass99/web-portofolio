export const formatMediaUrl = (idOrUrl?: string | null, width = 1200) => {
  if (!idOrUrl) return "";

  if (idOrUrl.startsWith("http://") || idOrUrl.startsWith("https://")) {
    return idOrUrl;
  }

  return `https://drive.google.com/thumbnail?sz=w${width}&id=${idOrUrl}`;
};
