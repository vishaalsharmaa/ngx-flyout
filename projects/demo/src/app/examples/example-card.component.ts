import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { CodeFile } from './example-code';

let nextId = 0;

/** A demo card with a Preview tab (projected content) and a Code tab (static source). */
@Component({
  selector: 'app-example-card',
  imports: [CodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card shadow-sm">
      <div class="card-header bg-body">
        <ul class="nav nav-tabs card-header-tabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              type="button"
              class="nav-link"
              role="tab"
              [id]="id + '-preview-tab'"
              [class.active]="tab() === 'preview'"
              [attr.aria-selected]="tab() === 'preview'"
              [attr.aria-controls]="id + '-panel'"
              (click)="tab.set('preview')"
            >
              Preview
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              type="button"
              class="nav-link"
              role="tab"
              [id]="id + '-code-tab'"
              [class.active]="tab() === 'code'"
              [attr.aria-selected]="tab() === 'code'"
              [attr.aria-controls]="id + '-panel'"
              (click)="tab.set('code')"
            >
              Code
            </button>
          </li>
        </ul>
      </div>

      <div
        class="card-body"
        role="tabpanel"
        [id]="id + '-panel'"
        [attr.aria-labelledby]="id + (tab() === 'preview' ? '-preview-tab' : '-code-tab')"
      >
        <h2 class="h5 card-title">{{ heading() }}</h2>

        <!-- Kept in the DOM (hidden) so the preview's template references stay alive. -->
        <div [hidden]="tab() !== 'preview'">
          <ng-content />
        </div>

        @if (tab() === 'code') {
          @for (file of files(); track $index) {
            <app-code-block class="d-block mb-3" [lang]="file.lang" [code]="file.code" />
          }
        }
      </div>
    </div>
  `,
})
export class ExampleCardComponent {
  readonly heading = input.required<string>();
  readonly files = input.required<CodeFile[]>();

  protected readonly id = `example-${nextId++}`;
  protected readonly tab = signal<'preview' | 'code'>('preview');
}
