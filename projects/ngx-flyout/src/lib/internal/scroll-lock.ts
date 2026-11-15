/**
 * Locks page scrolling while at least one flyout is open.
 * Counts locks so that closing a nested flyout keeps the page locked
 * until the last one closes.
 */
let lockCount = 0;
let saved: { overflow: string; paddingRight: string } | null = null;

export function lockScroll(doc: Document): void {
  if (lockCount++ > 0) return;
  const root = doc.documentElement;
  const win = doc.defaultView;
  // Keep the layout from jumping when the scrollbar disappears.
  const scrollbar = win ? win.innerWidth - root.clientWidth : 0;
  saved = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
  root.style.overflow = 'hidden';
  if (scrollbar > 0) {
    root.style.paddingRight = `${scrollbar}px`;
  }
}

export function unlockScroll(doc: Document): void {
  if (lockCount === 0 || --lockCount > 0) return;
  const root = doc.documentElement;
  if (saved) {
    root.style.overflow = saved.overflow;
    root.style.paddingRight = saved.paddingRight;
    saved = null;
  }
}
