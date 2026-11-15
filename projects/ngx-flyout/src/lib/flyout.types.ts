/**
 * How the user dismissed the flyout, passed with the `cancel` output.
 *
 * - `button`: the footer's Cancel button
 * - `close`: the × button in the header
 * - `escape`: the Escape key
 * - `backdrop`: a click outside the panel (only when `hideOnBackdropClick` is on)
 */
export type FlyoutCancelReason = 'button' | 'close' | 'escape' | 'backdrop';

/**
 * How the flyout opens and closes.
 *
 * - `none`: it appears and disappears at once (default)
 * - `slide`: it slides in from the right and back out again
 */
export type FlyoutAnimation = 'none' | 'slide';

/** Input transform for `animation`: also accepts `true` (slide) and `false` / `null` (none). */
export function toFlyoutAnimation(value: FlyoutAnimation | boolean | null | undefined): FlyoutAnimation {
  return value === 'slide' || value === true ? 'slide' : 'none';
}

/** Default text for the built-in buttons. Override these to translate them. */
export interface FlyoutLabels {
  /** Primary footer button. */
  confirm: string;
  /** Secondary footer button. */
  cancel: string;
  /** Screen-reader name of the × button. */
  close: string;
}
