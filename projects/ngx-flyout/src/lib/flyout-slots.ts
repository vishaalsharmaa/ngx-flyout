import { Directive } from '@angular/core';

/**
 * Marks projected content shown in the icon tile next to the heading.
 * The tile only appears when this slot is used.
 *
 * ```html
 * <ngx-flyout heading="Project details"><svg ngxFlyoutIcon>…</svg>Body</ngx-flyout>
 * ```
 */
@Directive({ selector: '[ngxFlyoutIcon]' })
export class NgxFlyoutIcon {}

/**
 * Marks projected content that replaces the built-in Cancel / OK buttons.
 *
 * ```html
 * <ngx-flyout heading="Share">
 *   Body
 *   <div ngxFlyoutFooter><button (click)="flyout.close()">Done</button></div>
 * </ngx-flyout>
 * ```
 */
@Directive({ selector: '[ngxFlyoutFooter]' })
export class NgxFlyoutFooter {}
