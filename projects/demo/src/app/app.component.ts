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
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" routerLink="/documentation" routerLinkActive="active" ariaCurrentWhenActive="page">
              Documentation
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/examples" routerLinkActive="active" ariaCurrentWhenActive="page">
              Examples
            </a>
          </li>
        </ul>
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
