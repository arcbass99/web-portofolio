export const normalizeExternalUrl = (url: string) => {
  const trimmedUrl = url.trim();

  if (!trimmedUrl) return "";

  if (
    trimmedUrl.startsWith("http://") ||
    trimmedUrl.startsWith("https://") ||
    trimmedUrl.startsWith("mailto:") ||
    trimmedUrl.startsWith("tel:")
  ) {
    return trimmedUrl;
  }

  // If user enters an email address directly (e.g. name@domain.com)
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedUrl)) {
    return `mailto:${trimmedUrl}`;
  }

  return `https://${trimmedUrl}`;
};

export const isValidExternalUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.protocol === "http:" ||
      parsedUrl.protocol === "https:" ||
      parsedUrl.protocol === "mailto:" ||
      parsedUrl.protocol === "tel:"
    );
  } catch {
    return false;
  }
};
