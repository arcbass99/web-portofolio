export const normalizeExternalUrl = (url: string) => {
  const trimmedUrl = url.trim();

  if (!trimmedUrl) return "";

  if (
    trimmedUrl.startsWith("http://") ||
    trimmedUrl.startsWith("https://")
  ) {
    return trimmedUrl;
  }

  return `https://${trimmedUrl}`;
};

export const isValidExternalUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};
