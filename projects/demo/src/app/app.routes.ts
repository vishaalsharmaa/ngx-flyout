import { Routes } from '@angular/router';

/** Each page is lazy-loaded, so visitors only download the page they open. */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'documentation' },
  {
    path: 'documentation',
    title: 'Documentation · ngx-flyout',
    loadComponent: () => import('./documentation/documentation.page').then((m) => m.DocumentationPage),
  },
  {
    path: 'examples',
    title: 'Examples · ngx-flyout',
    loadComponent: () => import('./examples/examples.page').then((m) => m.ExamplesPage),
  },
  { path: '**', redirectTo: 'documentation' },
];
