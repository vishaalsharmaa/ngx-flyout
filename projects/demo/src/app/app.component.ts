import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import libPackage from '../../../ngx-flyout/package.json';

/** App shell: navbar, the current page, footer. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="navbar navbar-expand app-navbar border-bottom shadow-sm sticky-top" data-bs-theme="dark">
      <div class="container">
        <a class="navbar-brand fw-semibold" routerLink="/documentation">ngx-flyout</a>
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <a class="nav-link" routerLink="/documentation" routerLinkActive="active" ariaCurrentWhenActive="page">
              <span class="d-none d-sm-inline">Documentation</span>
              <span class="d-sm-none">Docs</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/examples" routerLinkActive="active" ariaCurrentWhenActive="page">
              Examples
            </a>
          </li>
        </ul>

        <!-- Install command (hidden on small and medium screens) -->
        <div class="d-none d-lg-flex align-items-center gap-2 border rounded-3 bg-body-tertiary ps-3 pe-1 py-1 me-2">
          <code class="text-body-secondary small">{{ installCommand }}</code>
          <button
            type="button"
            class="btn btn-sm btn-link text-body fw-semibold text-decoration-none"
            (click)="copyInstall()"
            [attr.aria-label]="'Copy ' + installCommand"
          >
            {{ installCopied() ? 'Copied' : 'Copy' }}
          </button>
        </div>

        <!-- Links -->
        <div class="d-flex align-items-center gap-2 flex-shrink-0">
          <a
            class="btn btn-light btn-sm d-inline-flex align-items-center gap-1"
            href="https://github.com/vishaalsharmaa/ngx-flyout"
            target="_blank"
            rel="noopener"
            aria-label="GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
            <span class="d-none d-sm-inline">GitHub</span>
          </a>
          <a
            class="btn btn-light btn-sm d-inline-flex align-items-center"
            href="https://www.npmjs.com/package/ngx-flyout"
            target="_blank"
            rel="noopener"
            aria-label="npm"
          >
            <!-- npm logo, cropped from its 128×128 box to the wordmark itself -->
            <svg height="16" viewBox="2 38.5 124 51" aria-hidden="true">
              <path
                fill="#cb3837"
                d="M2 38.5h124v43.71H64v7.29H36.44v-7.29H2zm6.89 36.43h13.78V53.07h6.89v21.86h6.89V45.79H8.89zm34.44-29.14v36.42h13.78v-7.28h13.78V45.79zm13.78 7.29H64v14.56h-6.89zm20.67-7.29v29.14h13.78V53.07h6.89v21.86h6.89V53.07h6.89v21.86h6.89V45.79z"
              />
            </svg>
          </a>
        </div>
      </div>
    </nav>

    <router-outlet />

    <div class="container">
      <footer
        class="border-top mt-5 py-4 d-flex flex-wrap justify-content-center align-items-center gap-2 small text-body-secondary"
      >
        <code class="text-body bg-body-secondary px-2 rounded">v{{ version }}</code>
        <span aria-hidden="true">·</span>
        <span>MIT License</span>
        <span aria-hidden="true">·</span>
        <span>
          Maintained by
          <a class="link-primary text-decoration-none" href="https://github.com/vishaalsharmaa" target="_blank" rel="noopener">vishaalsharmaa</a>
        </span>
      </footer>
    </div>
  `,
})
export class AppComponent {
  /** Library version, read from projects/ngx-flyout/package.json. */
  protected readonly version = libPackage.version;

  /** Shown in the navbar with a Copy button. */
  protected readonly installCommand = 'npm i ngx-flyout';
  protected readonly installCopied = signal(false);

  constructor() {
    // Keep #section links from scrolling under the sticky navbar.
    inject(ViewportScroller).setOffset([0, 72]);
  }

  /** Copies the install command and shows "Copied" on the button for 1.5 seconds. */
  protected async copyInstall(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.installCommand);
      this.installCopied.set(true);
      setTimeout(() => this.installCopied.set(false), 1500);
    } catch {
      this.installCopied.set(false);
    }
  }
}
