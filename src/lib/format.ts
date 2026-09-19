/** Formats byte counts without losing useful detail for small evidence files. */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 bytes"
  if (bytes < 1024) return `${Math.round(bytes)} bytes`
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(bytes < 10 * 1024 * 1024 ? 1 : 0)} MB`
}
