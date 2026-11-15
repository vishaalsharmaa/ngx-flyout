/** One file shown in an example's Code tab. */
export interface CodeFile {
  lang: 'HTML' | 'TS';
  code: string;
}

/** Static source for each demo example, shown in its Code tab. */
export const EXAMPLE_CODE: Record<
  'templateRef' | 'twoWay' | 'ownButtons' | 'asyncSave' | 'icon' | 'customFooter' | 'labelsColor' | 'slideAnimation',
  CodeFile[]
> = {
  templateRef: [
    {
      lang: 'HTML',
      code: `<button type="button" class="btn btn-primary" (click)="details.open()">
  Open project details
</button>

<ngx-flyout
  #details
  heading="Project details"
  subheading="acme-web · Last deployed 2 hours ago"
  confirmLabel="Open project"
  (confirm)="openProject()"
  (cancel)="onCancel($event)"
>
  <p>
    The main web app for Acme. Builds run on every push to <code>main</code>
    and deploy to production after checks pass.
  </p>
  <!-- any content you like -->
</ngx-flyout>`,
    },
    {
      lang: 'TS',
      code: `import { Component } from '@angular/core';
import { FlyoutCancelReason, NgxFlyout } from 'ngx-flyout';

@Component({
  selector: 'app-project-details',
  imports: [NgxFlyout],
  templateUrl: './project-details.component.html',
})
export class ProjectDetailsComponent {
  openProject(): void {
    // OK was clicked; the flyout closes on its own.
  }

  onCancel(reason: FlyoutCancelReason): void {
    // 'button' | 'close' | 'escape' | 'backdrop'
    console.log('Dismissed with', reason);
  }
}`,
    },
  ],

  twoWay: [
    {
      lang: 'HTML',
      code: `<button type="button" class="btn btn-primary" (click)="settingsOpen.set(true)">
  Open settings
</button>
<span class="badge text-bg-secondary">opened: {{ settingsOpen() }}</span>

<ngx-flyout
  [(opened)]="settingsOpen"
  heading="Settings"
  confirmLabel="Apply"
  hideOnBackdropClick
  (confirm)="applySettings()"
>
  <div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" role="switch" id="setting-email" checked />
    <label class="form-check-label" for="setting-email">Email me when a deployment fails</label>
  </div>
</ngx-flyout>`,
    },
    {
      lang: 'TS',
      code: `import { Component, signal } from '@angular/core';
import { NgxFlyout } from 'ngx-flyout';

@Component({
  selector: 'app-settings',
  imports: [NgxFlyout],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  /** Updated by the flyout too: ×, Escape and outside clicks set it to false. */
  readonly settingsOpen = signal(false);

  applySettings(): void {
    // save the settings
  }
}`,
    },
  ],

  ownButtons: [
    {
      lang: 'HTML',
      code: `<button type="button" class="btn btn-primary" (click)="userFlyout.open()">Edit user</button>

<ngx-flyout
  #userFlyout
  heading="Edit user"
  subheading="Changes apply right away"
  showFooter="false"
>
  <app-user-form
    (saved)="onSaved($event); userFlyout.close()"
    (cancelled)="userFlyout.close()"
  />
</ngx-flyout>`,
    },
    {
      lang: 'TS',
      code: `import { Component } from '@angular/core';
import { NgxFlyout } from 'ngx-flyout';
import { UserFormComponent, UserFormValue } from './user-form.component';

@Component({
  selector: 'app-users',
  imports: [NgxFlyout, UserFormComponent],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  onSaved(value: UserFormValue): void {
    // save the user
  }
}`,
    },
    {
      lang: 'TS',
      code: `import { Component, output } from '@angular/core';

export interface UserFormValue {
  name: string;
  email: string;
}

/** Knows nothing about the flyout: it only emits saved / cancelled. */
@Component({
  selector: 'app-user-form',
  template: \`
    <form (submit)="onSubmit($event, name.value, email.value)">
      <label class="form-label" for="user-name">Name</label>
      <input #name id="user-name" class="form-control mb-3" />

      <label class="form-label" for="user-email">Email</label>
      <input #email id="user-email" type="email" class="form-control mb-4" />

      <div class="d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-outline-secondary" (click)="cancelled.emit()">Cancel</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
  \`,
})
export class UserFormComponent {
  readonly saved = output<UserFormValue>();
  readonly cancelled = output<void>();

  onSubmit(event: Event, name: string, email: string): void {
    event.preventDefault();
    this.saved.emit({ name, email });
  }
}`,
    },
  ],

  asyncSave: [
    {
      lang: 'HTML',
      code: `<button type="button" class="btn btn-primary" (click)="renameFlyout.open()">Rename project</button>

<ngx-flyout
  #renameFlyout
  heading="Rename project"
  [confirmLabel]="saving() ? 'Saving…' : 'Save'"
  [confirmDisabled]="saving()"
  closeOnConfirm="false"
  showCloseButton="false"
  (confirm)="save(renameFlyout, projectName.value)"
>
  <label class="form-label" for="project-name">Project name</label>
  <input #projectName id="project-name" class="form-control" value="acme-web" />
</ngx-flyout>`,
    },
    {
      lang: 'TS',
      code: `import { Component, inject, signal } from '@angular/core';
import { NgxFlyout } from 'ngx-flyout';
import { ProjectService } from './project.service'; // your own service

@Component({
  selector: 'app-rename-project',
  imports: [NgxFlyout],
  templateUrl: './rename-project.component.html',
})
export class RenameProjectComponent {
  private readonly projects = inject(ProjectService);
  readonly saving = signal(false);

  async save(flyout: NgxFlyout, name: string): Promise<void> {
    this.saving.set(true);
    try {
      await this.projects.rename(name);
      flyout.close(); // close() does not emit (cancel)
    } finally {
      this.saving.set(false);
    }
  }
}`,
    },
  ],

  icon: [
    {
      lang: 'HTML',
      code: `<button type="button" class="btn btn-primary" (click)="deploy.open()">Show deployment</button>

<ngx-flyout #deploy heading="Deployment v2.4.1" subheading="Finished 2 hours ago" confirmLabel="View logs">
  <!-- Any inline SVG or icon component; it is sized and coloured for you. -->
  <svg ngxFlyoutIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10" />
    <path d="m8.5 12.5 2.5 2.5 5-5.5" />
  </svg>

  <p>All checks passed and the new version is live in production.</p>
</ngx-flyout>`,
    },
    {
      lang: 'TS',
      code: `import { Component } from '@angular/core';
import { NgxFlyout, NgxFlyoutIcon } from 'ngx-flyout';

@Component({
  selector: 'app-deployment',
  imports: [NgxFlyout, NgxFlyoutIcon],
  templateUrl: './deployment.component.html',
})
export class DeploymentComponent {}`,
    },
  ],

  customFooter: [
    {
      lang: 'HTML',
      code: `<button type="button" class="btn btn-primary" (click)="share.open()">Share project</button>

<ngx-flyout #share heading="Share project">
  <label class="form-label" for="share-link">Anyone with this link can view the project</label>
  <input id="share-link" class="form-control" value="https://example.com/p/acme-web" readonly />

  <!-- Replaces the built-in Cancel / OK buttons -->
  <div ngxFlyoutFooter class="d-flex justify-content-between w-100">
    <button type="button" class="btn btn-outline-secondary" (click)="copyLink()">Copy link</button>
    <button type="button" class="btn btn-primary" (click)="share.close()">Done</button>
  </div>
</ngx-flyout>`,
    },
    {
      lang: 'TS',
      code: `import { Component } from '@angular/core';
import { NgxFlyout, NgxFlyoutFooter } from 'ngx-flyout';

@Component({
  selector: 'app-share',
  imports: [NgxFlyout, NgxFlyoutFooter],
  templateUrl: './share.component.html',
})
export class ShareComponent {
  copyLink(): void {
    navigator.clipboard.writeText('https://example.com/p/acme-web');
  }
}`,
    },
  ],

  labelsColor: [
    {
      lang: 'HTML',
      code: `<button type="button" class="btn btn-danger" (click)="remove.open()">Delete project</button>

<ngx-flyout
  #remove
  heading="Delete acme-web?"
  subheading="This can't be undone"
  confirmLabel="Delete project"
  cancelLabel="Keep it"
  style="--ngx-flyout-accent: #dc3545"
  (confirm)="deleteProject()"
>
  <p>Deleting the project removes its deployments, environment variables and logs.</p>
</ngx-flyout>`,
    },
    {
      lang: 'TS',
      code: `// Set colours or labels for every flyout in your app (optional):
import { ApplicationConfig } from '@angular/core';
import { provideFlyout } from 'ngx-flyout';

export const appConfig: ApplicationConfig = {
  providers: [provideFlyout({ labels: { confirm: 'Save', cancel: 'Close' } })],
};

/* styles.css: one colour for all flyouts */
/* :root { --ngx-flyout-accent: #6f42c1; } */`,
    },
  ],

  slideAnimation: [
    {
      lang: 'HTML',
      code: `<button type="button" class="btn btn-primary" (click)="filters.open()">Filters</button>

<!-- animation: 'none' (default) | 'slide' -->
<ngx-flyout #filters heading="Filters" animation="slide" confirmLabel="Apply">
  <div class="form-check">
    <input class="form-check-input" type="checkbox" id="filter-active" checked />
    <label class="form-check-label" for="filter-active">Active projects only</label>
  </div>
</ngx-flyout>`,
    },
    {
      lang: 'TS',
      code: `// Optional: slide every flyout in your app by default
import { ApplicationConfig } from '@angular/core';
import { provideFlyout } from 'ngx-flyout';

export const appConfig: ApplicationConfig = {
  providers: [provideFlyout({ animation: 'slide' })],
};`,
    },
  ],
};
