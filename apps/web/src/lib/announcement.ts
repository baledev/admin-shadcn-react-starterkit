const STORAGE_KEY = "announcement:dismissed"

export function isAnnouncementDismissed(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(STORAGE_KEY) === "true"
}

export function dismissAnnouncement(): void {
  localStorage.setItem(STORAGE_KEY, "true")
}
