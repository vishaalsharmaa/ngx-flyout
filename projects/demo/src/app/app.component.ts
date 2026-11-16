import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import libPackage from '../../../ngx-flyout/package.json';

/** App shell: navbar, the current page, footer. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="navbar navbar-expand bg-body border-bottom sticky-top">
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

        <!-- Links -->
        <div class="d-flex align-items-center gap-2 flex-shrink-0">
          <a
            class="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
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
            class="btn btn-outline-secondary btn-sm"
            href="https://www.npmjs.com/package/ngx-flyout"
            target="_blank"
            rel="noopener"
            aria-label="npm"
          >
            npm
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

  constructor() {
    // Keep #section links from scrolling under the sticky navbar.
    inject(ViewportScroller).setOffset([0, 72]);
  }
}
