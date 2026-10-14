export const extractGoogleDriveId = (idOrUrl?: string | null): string | null => {
  if (!idOrUrl) return null;
  const trimmed = idOrUrl.trim();
  if (!trimmed) return null;

  // Pattern 1: /file/d/{id}
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];

  // Pattern 2: ?id={id} or &id={id}
  const queryMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (queryMatch) return queryMatch[1];

  // If it's another external URL (not Google Drive), return null
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return null;
  }

  // Otherwise treat as raw Google Drive File ID
  return trimmed;
};

export const formatMediaUrl = (idOrUrl?: string | null, width = 1200): string => {
  if (!idOrUrl) return "";
  const trimmed = idOrUrl.trim();
  if (!trimmed) return "";

  const driveId = extractGoogleDriveId(trimmed);
  if (driveId) {
    return `https://drive.google.com/thumbnail?sz=w${width}&id=${driveId}`;
  }

  return trimmed;
};

export const formatVideoEmbedUrl = (idOrUrl?: string | null): string => {
  if (!idOrUrl) return "";
  const trimmed = idOrUrl.trim();
  if (!trimmed) return "";

  const driveId = extractGoogleDriveId(trimmed);
  if (driveId) {
    return `https://drive.google.com/file/d/${driveId}/preview`;
  }

  return trimmed;
};
