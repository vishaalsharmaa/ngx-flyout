# ngx-flyout

**An accessible side flyout for Angular.** A panel that opens from the right, over your app, with a heading, your own content and Cancel / OK buttons, and zero dependencies.

[![npm version](https://img.shields.io/npm/v/ngx-flyout?color=0f6f8c)](https://www.npmjs.com/package/ngx-flyout)
[![npm downloads](https://img.shields.io/npm/dm/ngx-flyout?color=8250df)](https://www.npmjs.com/package/ngx-flyout)
[![downloads in the last 18 months](https://img.shields.io/npm/d18m/ngx-flyout?color=12a594)](https://www.npmjs.com/package/ngx-flyout)
[![license: MIT](https://img.shields.io/npm/l/ngx-flyout?color=1689ad)](https://github.com/vishaalsharmaa/ngx-flyout/blob/main/LICENSE)

Think of `<ngx-flyout>` as a side panel that slides over your page: a heading, anything you put inside, and buttons to confirm or cancel. The page behind it stays in view, so users never lose their place.

```html
<button type="button" (click)="editUser.open()">Edit user</button>

<ngx-flyout #editUser heading="Edit user" subheading="Changes apply right away" (confirm)="save()">
  Anything you put here shows in the flyout.
</ngx-flyout>
```

## Table of contents

- [Features](#features)
- [Install](#install)
- [Usage](#usage)
- [Inputs](#inputs)
- [Outputs and methods](#outputs-and-methods)
- [Examples](#examples)
  - [Two-way binding](#two-way-binding)
  - [Content with its own buttons](#content-with-its-own-buttons)
  - [Close after saving](#close-after-saving)
  - [Custom icon and footer](#custom-icon-and-footer)
  - [Slide animation](#slide-animation)
- [Accessibility](#accessibility)
- [Global configuration](#global-configuration)
- [Development](#development)
- [License](#license)

## Features

- **Heading, sub-heading and any content** through `ng-content`
- **Cancel / OK footer** built in, or your own footer
- **Three ways to open and close**: template reference, `[(opened)]` two-way binding, or `open()` / `close()` from code
- **Tells you how it was closed**: Cancel, ×, Escape or a click outside
- **Accessible**: built on the native `<dialog>`, with focus handling, Escape to close and a stable `id` on every element
- **Always on top**: the browser's top layer, so no z-index fights, even from inside a scrolling component
- **Optional slide animation**, off by default and skipped for users who prefer reduced motion
- **Standalone component**, signal inputs, `OnPush`, and no dependencies besides Angular

## Install

```bash
npm install ngx-flyout
```

Requires Angular 19 or newer.

## Usage

Import `NgxFlyout` into a standalone component:

```ts
import { Component } from '@angular/core';
import { FlyoutCancelReason, NgxFlyout } from 'ngx-flyout';

@Component({
  selector: 'app-page',
  imports: [NgxFlyout],
  template: `
    <button type="button" (click)="details.open()">Project details</button>

    <ngx-flyout
      #details
      heading="Project details"
      subheading="acme-web · Last deployed 2 hours ago"
      confirmLabel="Open project"
      (confirm)="openProject()"
      (cancel)="onCancel($event)"
    >
      Any content goes here, including <a href="/docs">links</a> and your own components.
    </ngx-flyout>
  `,
})
export class PageComponent {
  openProject(): void {
    // OK was clicked; the flyout closes on its own
  }

  onCancel(reason: FlyoutCancelReason): void {
    // 'button' | 'close' | 'escape' | 'backdrop'
  }
}
```

Clicking the button opens the flyout. Cancel, ×, Escape or OK close it.

## Inputs

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `opened` | `boolean` | `false` | Whether the flyout is showing. Supports two-way binding: `[(opened)]`. |
| `heading` | `string` | `''` | Heading at the top. Also the flyout's accessible name. Hidden when empty. |
| `subheading` | `string` | `''` | Lighter text under the heading. Hidden when empty. |
| `confirmLabel` | `string` | `'OK'` | Text of the primary button. |
| `cancelLabel` | `string` | `'Cancel'` | Text of the secondary button. |
| `confirmDisabled` | `boolean` | `false` | Disables the primary button, for example while a form is invalid or saving. |
| `showFooter` | `boolean` | `true` | Shows the Cancel / OK footer. Turn off when your content has its own buttons. |
| `showCloseButton` | `boolean` | `true` | Shows the × button in the header. Escape still closes the flyout. |
| `closeOnConfirm` | `boolean` | `true` | Closes the flyout after the primary button. Turn off to close it yourself, e.g. after saving. |
| `hideOnBackdropClick` | `boolean` | `false` | Closes the flyout when the user clicks outside the panel. |
| `animation` | `'none' \| 'slide'` | `'none'` | `'slide'` slides the flyout in from the right and back out on close. |
| `id` | `string` | `ngx-flyout-{n}` | Id of the flyout; inner element ids are derived from it. |

Boolean inputs also work as bare attributes: `<ngx-flyout hideOnBackdropClick showFooter="false">`.

## Outputs and methods

| Output | Type | Description |
| --- | --- | --- |
| `confirm` | `void` | Emits when the primary (OK) button is clicked. |
| `cancel` | `'button' \| 'close' \| 'escape' \| 'backdrop'` | Emits when the user dismisses the flyout, with how: the Cancel button, the ×, the Escape key, or a click outside (only with `hideOnBackdropClick`). |
| `openedChange` | `boolean` | Emits `true` when the flyout opens and `false` when it closes. Used by `[(opened)]`. |

| Method | Description |
| --- | --- |
| `open()` | Opens the flyout. |
| `close()` | Closes the flyout. |
| `toggle()` | Switches between open and closed. |

The methods never emit `confirm` or `cancel`. Those only fire when the user clicks a button or presses Escape.

## Examples

### Two-way binding

When the open state lives in your component, bind it with `[(opened)]`. It updates when the user closes the flyout with Cancel, × or Escape.

```html
<!-- settingsOpen = signal(false) -->
<button type="button" (click)="settingsOpen.set(true)">Settings</button>

<ngx-flyout [(opened)]="settingsOpen" heading="Settings" confirmLabel="Apply" (confirm)="apply()">…</ngx-flyout>
```

Use `[(opened)]`, not one-way `[opened]`. With one-way binding your value stays `true` after the user closes the flyout, and setting it to `true` again does nothing.

### Content with its own buttons

`showFooter="false"` hides the built-in buttons. Your component emits its own events, and the parent closes the flyout:

```html
<ngx-flyout #userFlyout heading="Edit user" showFooter="false">
  <app-user-form
    (saved)="onSaved($event); userFlyout.close()"
    (cancelled)="userFlyout.close()"
  />
</ngx-flyout>
```

The form doesn't need to know it is inside a flyout, so you can reuse it anywhere.

### Close after saving

`closeOnConfirm="false"` keeps the flyout open after OK, so you can close it once an async save has finished:

```html
<ngx-flyout
  #rename
  heading="Rename project"
  [confirmLabel]="saving() ? 'Saving…' : 'Save'"
  [confirmDisabled]="saving()"
  closeOnConfirm="false"
  (confirm)="save(rename)"
>
  …
</ngx-flyout>
```

```ts
async save(flyout: NgxFlyout): Promise<void> {
  this.saving.set(true);
  try {
    await this.projects.rename(this.name);
    flyout.close(); // close() does not emit (cancel)
  } finally {
    this.saving.set(false);
  }
}
```

To reach the flyout from TypeScript without passing it in, use `viewChild.required(NgxFlyout)`.

### Custom icon and footer

The default slot takes any content. Two named slots add an icon next to the heading, or replace the Cancel / OK buttons:

```html
<ngx-flyout #share heading="Share project">
  <svg ngxFlyoutIcon viewBox="0 0 24 24">…</svg>

  <input value="https://example.com/p/acme-web" readonly />

  <div ngxFlyoutFooter>
    <button type="button" (click)="copyLink()">Copy link</button>
    <button type="button" (click)="share.close()">Done</button>
  </div>
</ngx-flyout>
```

Import `NgxFlyoutIcon` and `NgxFlyoutFooter` alongside `NgxFlyout` to use them.

### Slide animation

The flyout appears at once by default. With `animation="slide"` it slides in from the right and back out on close:

```html
<ngx-flyout heading="Filters" animation="slide">…</ngx-flyout>
```

There is no animation for users who prefer reduced motion. In browsers without the newer CSS it uses, the flyout simply appears.

## Accessibility

With `id="edit-user"`, the flyout renders:

| Element | id | Accessibility |
| --- | --- | --- |
| Flyout | `edit-user` | Native modal `<dialog>`, `aria-labelledby="edit-user-heading"`, `aria-describedby="edit-user-subheading"` |
| Heading | `edit-user-heading` | `<h2>` |
| Sub-heading | `edit-user-subheading` | |
| Body | `edit-user-body` | |
| Close button | `edit-user-close` | `aria-label="Close"` |

- While the flyout is open, the page behind it can't be clicked or reached with the keyboard.
- Focus moves into the flyout when it opens and returns to the element that opened it when it closes.
- Escape closes it, and page scrolling is locked while it is open.
- All buttons are at least 44px tall.
- All screen-reader and button text can be translated with [global configuration](#global-configuration).

## Global configuration

Set defaults for every flyout in `app.config.ts`. Everything is optional:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideFlyout } from 'ngx-flyout';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFlyout({
      showFooter: true,
      showCloseButton: true,
      closeOnConfirm: true,
      hideOnBackdropClick: false,
      animation: 'slide',
      // Translate the button and screen-reader text
      labels: { confirm: 'Speichern', cancel: 'Abbrechen', close: 'Schließen' },
    }),
  ],
};
```

Inputs on a single flyout always win over these defaults.

## Development

```bash
npm install
npm run build:lib    # builds dist/ngx-flyout
npm start            # demo app at http://localhost:4200
```

## License

[MIT](https://github.com/vishaalsharmaa/ngx-flyout/blob/main/LICENSE) © 2026 Vishal Sharma
