import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  inject,
  input,
  model,
  output,
  untracked,
  viewChild,
} from '@angular/core';
import { NGX_FLYOUT_CONFIG } from './flyout.config';
import { NgxFlyoutIcon } from './flyout-slots';
import { FlyoutCancelReason, toFlyoutAnimation } from './flyout.types';
import { lockScroll, unlockScroll } from './internal/scroll-lock';

let nextId = 0;

/** Element ids inside one flyout, all derived from the flyout's own `id`. */
export interface FlyoutElementIds {
  dialog: string;
  heading: string;
  subheading: string;
  body: string;
  close: string;
}

/**
 * A side flyout that slides in from the right, over the whole app.
 * It has a heading, your projected content, and Cancel / OK buttons.
 *
 * Open it with a template reference, `[(opened)]`, or from code:
 *
 * ```html
 * <button (click)="flyout.open()">Edit user</button>
 *
 * <ngx-flyout #flyout heading="Edit user" (confirm)="save()" (cancel)="discard()">
 *   <app-user-form />
 * </ngx-flyout>
 * ```
 */
@Component({
  selector: 'ngx-flyout',
  templateUrl: './flyout.component.html',
  styleUrl: './flyout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ngx-flyout-host' },
})
export class NgxFlyout {
  private readonly config = inject(NGX_FLYOUT_CONFIG);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Whether the flyout is showing. Supports two-way binding: `[(opened)]`. */
  readonly opened = model(false);

  /** Heading in the header. Also used as the flyout's accessible name. */
  readonly heading = input<string>('');

  /** Lighter line under the heading. Leave empty to hide it. */
  readonly subheading = input<string>('');

  /** Text of the primary button. Default: `'OK'`, or `provideFlyout({ labels })`. */
  readonly confirmLabel = input<string>('');

  /** Text of the secondary button. Default: `'Cancel'`, or `provideFlyout({ labels })`. */
  readonly cancelLabel = input<string>('');

  /** Disables the primary button, for example while a form is invalid or saving. */
  readonly confirmDisabled = input(false, { transform: booleanAttribute });

  /** Show the built-in Cancel / OK footer. Turn off when your content has its own buttons. */
  readonly showFooter = input(this.config.showFooter, { transform: booleanAttribute });

  /** Close automatically after the primary button is clicked. Turn off to close it yourself, e.g. after saving. */
  readonly closeOnConfirm = input(this.config.closeOnConfirm, { transform: booleanAttribute });

  /** A click outside the panel cancels and closes the flyout. Default: `false`. */
  readonly hideOnBackdropClick = input(this.config.hideOnBackdropClick, { transform: booleanAttribute });

  /** Show the × button in the header. Escape still closes the flyout when it is hidden. Default: `true`. */
  readonly showCloseButton = input(this.config.showCloseButton, { transform: booleanAttribute });

  /**
   * `'slide'`: slides in from the right and back out on close. `'none'` (default): appears at once.
   * The slide is skipped for users who prefer reduced motion.
   */
  readonly animation = input(this.config.animation, { transform: toFlyoutAnimation });

  /** Id of the dialog element. Inner elements get ids derived from it. Generated when not set. */
  readonly id = input<string>(`ngx-flyout-${nextId++}`);

  /** The primary (OK) button was clicked. */
  readonly confirm = output<void>();

  /** The user dismissed the flyout: Cancel, ×, Escape, or a backdrop click (with `hideOnBackdropClick`). Not emitted by `close()`. */
  readonly cancel = output<FlyoutCancelReason>();

  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  protected readonly projectedIcon = contentChild(NgxFlyoutIcon);

  protected readonly resolvedConfirmLabel = computed(
    () => this.confirmLabel() || this.config.labels.confirm,
  );
  protected readonly resolvedCancelLabel = computed(
    () => this.cancelLabel() || this.config.labels.cancel,
  );
  protected readonly closeLabel = this.config.labels.close;

  readonly ids = computed<FlyoutElementIds>(() => {
    const id = this.id();
    return {
      dialog: id,
      heading: `${id}-heading`,
      subheading: `${id}-subheading`,
      body: `${id}-body`,
      close: `${id}-close`,
    };
  });

  /** Element that had focus before opening; focus goes back to it on close. */
  private returnFocus: HTMLElement | null = null;
  private scrollLocked = false;
  /** Whether the current pointer press started on the backdrop. */
  private pressedBackdrop = false;

  constructor() {
    effect(() => {
      const isOpen = this.opened();
      const dialog = this.dialog()?.nativeElement;
      if (!dialog || !this.isBrowser) return;
      untracked(() => (isOpen ? this.show(dialog) : this.hide(dialog)));
    });

    inject(DestroyRef).onDestroy(() => this.releaseScroll());
  }

  /** Opens the flyout. */
  open(): void {
    this.opened.set(true);
  }

  /** Closes the flyout without emitting `cancel` or `confirm`. */
  close(): void {
    this.opened.set(false);
  }

  /** Opens the flyout when closed, closes it when open. */
  toggle(): void {
    this.opened.update((value) => !value);
  }

  protected onConfirm(): void {
    if (this.confirmDisabled()) return;
    this.confirm.emit();
    if (this.closeOnConfirm()) this.close();
  }

  protected dismiss(reason: FlyoutCancelReason): void {
    this.cancel.emit(reason);
    this.close();
  }

  /** Escape key: the dialog's native `cancel` event. Closing goes through `opened` instead. */
  protected onNativeCancel(event: Event): void {
    event.preventDefault();
    this.dismiss('escape');
  }

  /** The dialog closed on its own (e.g. a `<form method="dialog">` inside it): keep `opened` in sync. */
  protected onNativeClose(): void {
    if (this.opened()) this.close();
  }

  protected onPointerDown(event: PointerEvent): void {
    this.pressedBackdrop = event.target === event.currentTarget;
  }

  /** The dialog covers the viewport; a click on the dialog itself (not the panel) is a backdrop click. */
  protected onDialogClick(event: MouseEvent): void {
    const onBackdrop = event.target === event.currentTarget && this.pressedBackdrop;
    this.pressedBackdrop = false;
    if (onBackdrop && this.hideOnBackdropClick()) this.dismiss('backdrop');
  }

  private show(dialog: HTMLDialogElement): void {
    if (dialog.open) return;
    const active = this.document.activeElement;
    this.returnFocus = active instanceof HTMLElement ? active : null;
    dialog.showModal();
    if (!this.scrollLocked) {
      lockScroll(this.document);
      this.scrollLocked = true;
    }
  }

  private hide(dialog: HTMLDialogElement): void {
    if (dialog.open) dialog.close();
    if (!this.scrollLocked) return;
    this.releaseScroll();
    const target = this.returnFocus;
    this.returnFocus = null;
    if (target?.isConnected) target.focus();
  }

  private releaseScroll(): void {
    if (!this.scrollLocked) return;
    unlockScroll(this.document);
    this.scrollLocked = false;
  }
}
