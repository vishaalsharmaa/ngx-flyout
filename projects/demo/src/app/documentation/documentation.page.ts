import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxFlyout } from 'ngx-flyout';
import { CodeBlockComponent } from '../shared/code-block.component';

interface ApiRow {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

@Component({
  selector: 'app-documentation-page',
  imports: [RouterLink, NgxFlyout, CodeBlockComponent],
  templateUrl: './documentation.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentationPage {
  protected readonly toc = [
    { id: 'what', label: 'What is a flyout?' },
    { id: 'why-flyout', label: 'Why your product needs one' },
    { id: 'use-cases', label: 'Use cases' },
    { id: 'why-ngx-flyout', label: 'Why ngx-flyout?' },
    { id: 'getting-started', label: 'Getting started' },
    { id: 'open-close', label: 'Opening and closing' },
    { id: 'api', label: 'API reference' },
    { id: 'styling', label: 'Styling' },
    { id: 'defaults', label: 'App-wide defaults' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'browsers', label: 'Browser support' },
  ];

  protected readonly installCode = `npm install ngx-flyout`;

  protected readonly importCode = `import { Component } from '@angular/core';
import { NgxFlyout } from 'ngx-flyout';

@Component({
  selector: 'app-users',
  imports: [NgxFlyout],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  save(): void {
    // OK was clicked
  }
}`;

  protected readonly firstFlyoutCode = `<button type="button" (click)="editUser.open()">Edit user</button>

<ngx-flyout #editUser heading="Edit user" (confirm)="save()">
  <p>Anything you put here shows in the flyout.</p>
</ngx-flyout>`;

  protected readonly templateRefCode = `<button (click)="flyout.open()">Open</button>
<ngx-flyout #flyout heading="Details">…</ngx-flyout>`;

  protected readonly twoWayCode = `<!-- isOpen = signal(false) in your component -->
<button (click)="isOpen.set(true)">Open</button>
<ngx-flyout [(opened)]="isOpen" heading="Details">…</ngx-flyout>`;

  protected readonly viewChildCode = `flyout = viewChild.required(NgxFlyout);

async save() {
  await this.api.save();
  this.flyout().close();
}`;

  protected readonly stylingCode = `/* styles.css: all flyouts */
:root {
  --ngx-flyout-accent: #6f42c1;
  --ngx-flyout-width: 520px;
}

/* or just one flyout, inline:
   <ngx-flyout style="--ngx-flyout-accent: #dc3545"> */`;

  protected readonly darkModeCode = `[data-bs-theme='dark'] {
  --ngx-flyout-bg: #212529;
  --ngx-flyout-ink: #dee2e6;
}`;

  protected readonly defaultsCode = `import { ApplicationConfig } from '@angular/core';
import { provideFlyout } from 'ngx-flyout';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFlyout({
      animation: 'slide',
      hideOnBackdropClick: true,
      labels: { confirm: 'Save', cancel: 'Close', close: 'Close panel' },
    }),
  ],
};`;

  protected readonly inputs: ApiRow[] = [
    { name: '[(opened)]', type: 'boolean', defaultValue: 'false', description: 'Whether the flyout is showing. Two-way binding.' },
    { name: 'heading', type: 'string', defaultValue: "''", description: 'Title at the top. Also read out by screen readers.' },
    { name: 'subheading', type: 'string', defaultValue: "''", description: 'Smaller grey line under the heading.' },
    { name: 'confirmLabel', type: 'string', defaultValue: "'OK'", description: 'Text of the main button.' },
    { name: 'cancelLabel', type: 'string', defaultValue: "'Cancel'", description: 'Text of the second button.' },
    { name: 'confirmDisabled', type: 'boolean', defaultValue: 'false', description: 'Greys out the main button, e.g. while a form is invalid.' },
    { name: 'showFooter', type: 'boolean', defaultValue: 'true', description: 'Show the Cancel / OK buttons. Turn off if your content has its own.' },
    { name: 'showCloseButton', type: 'boolean', defaultValue: 'true', description: 'Show the × in the corner. Escape still closes the flyout.' },
    { name: 'closeOnConfirm', type: 'boolean', defaultValue: 'true', description: 'Close by itself after the main button. Turn off to close it yourself after saving.' },
    { name: 'hideOnBackdropClick', type: 'boolean', defaultValue: 'false', description: 'Close when the user clicks outside the panel.' },
    { name: 'animation', type: "'none' | 'slide'", defaultValue: "'none'", description: "'slide' makes it slide in from the right and back out on close. Off by default." },
    { name: 'id', type: 'string', defaultValue: 'auto', description: 'Id of the flyout. Inner ids are built from it, e.g. {id}-heading.' },
  ];

  protected readonly outputs: ApiRow[] = [
    { name: '(confirm)', type: 'void', defaultValue: '', description: 'The main (OK) button was clicked.' },
    { name: '(cancel)', type: "'button' | 'close' | 'escape' | 'backdrop'", defaultValue: '', description: 'The user closed it: Cancel, ×, Escape or a click outside. Tells you which.' },
    { name: '(openedChange)', type: 'boolean', defaultValue: '', description: 'Any open or close. Used by [(opened)].' },
  ];

  protected readonly cssVars: ApiRow[] = [
    { name: '--ngx-flyout-accent', type: 'color', defaultValue: '#0f6f8c', description: 'Main button and icon tile.' },
    { name: '--ngx-flyout-on-accent', type: 'color', defaultValue: '#ffffff', description: 'Text on the main button.' },
    { name: '--ngx-flyout-bg', type: 'color', defaultValue: '#ffffff', description: 'Panel background.' },
    { name: '--ngx-flyout-ink', type: 'color', defaultValue: '#1b2230', description: 'Text colour. Greys and lines are mixed from it.' },
    { name: '--ngx-flyout-backdrop', type: 'color', defaultValue: 'rgba(15, 23, 42, 0.45)', description: 'Dark layer over your app.' },
    { name: '--ngx-flyout-width', type: 'length', defaultValue: '440px', description: 'Panel width. Never wider than the screen.' },
    { name: '--ngx-flyout-radius', type: 'length', defaultValue: '8px', description: 'Button corners.' },
    { name: '--ngx-flyout-duration', type: 'time', defaultValue: '280ms', description: "Slide speed, when animation is 'slide'." },
  ];
}
