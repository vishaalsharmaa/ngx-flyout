import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { FlyoutAnimation, FlyoutLabels } from './flyout.types';

/** App-wide settings for every `<ngx-flyout>`. */
export interface NgxFlyoutConfig {
  /** Default for the `closeOnConfirm` input. Default: `true`. */
  closeOnConfirm: boolean;
  /** Default for the `hideOnBackdropClick` input. Default: `false`. */
  hideOnBackdropClick: boolean;
  /** Default for the `showCloseButton` input. Default: `true`. */
  showCloseButton: boolean;
  /** Default for the `showFooter` input. Default: `true`. */
  showFooter: boolean;
  /** Default for the `animation` input. Default: `'none'`. */
  animation: FlyoutAnimation;
  /** Default button text. Override these to translate them. */
  labels: FlyoutLabels;
}

export const DEFAULT_FLYOUT_LABELS: FlyoutLabels = {
  confirm: 'OK',
  cancel: 'Cancel',
  close: 'Close',
};

export const DEFAULT_FLYOUT_CONFIG: NgxFlyoutConfig = {
  closeOnConfirm: true,
  hideOnBackdropClick: false,
  showCloseButton: true,
  showFooter: true,
  animation: 'none',
  labels: DEFAULT_FLYOUT_LABELS,
};

export const NGX_FLYOUT_CONFIG = new InjectionToken<NgxFlyoutConfig>('NGX_FLYOUT_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_FLYOUT_CONFIG,
});

/** Settings accepted by `provideFlyout()`. Everything is optional. */
export interface NgxFlyoutOptions {
  closeOnConfirm?: boolean;
  hideOnBackdropClick?: boolean;
  showCloseButton?: boolean;
  showFooter?: boolean;
  animation?: FlyoutAnimation;
  labels?: Partial<FlyoutLabels>;
}

/**
 * Sets app-wide defaults for flyouts. Optional: flyouts work without it.
 *
 * ```ts
 * providers: [provideFlyout({ animation: 'slide', hideOnBackdropClick: true, labels: { confirm: 'Save' } })]
 * ```
 */
export function provideFlyout(options: NgxFlyoutOptions = {}): EnvironmentProviders {
  const d = DEFAULT_FLYOUT_CONFIG;
  const config: NgxFlyoutConfig = {
    closeOnConfirm: options.closeOnConfirm ?? d.closeOnConfirm,
    hideOnBackdropClick: options.hideOnBackdropClick ?? d.hideOnBackdropClick,
    showCloseButton: options.showCloseButton ?? d.showCloseButton,
    showFooter: options.showFooter ?? d.showFooter,
    animation: options.animation ?? d.animation,
    labels: { ...DEFAULT_FLYOUT_LABELS, ...options.labels },
  };
  return makeEnvironmentProviders([{ provide: NGX_FLYOUT_CONFIG, useValue: config }]);
}
