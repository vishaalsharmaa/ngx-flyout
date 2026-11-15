import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

/** A static code snippet with a language label and a Copy button. Bootstrap classes only. */
@Component({
  selector: 'app-code-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="d-flex justify-content-between align-items-center mb-1">
      <span class="badge text-bg-light border">{{ lang() }}</span>
      <button type="button" class="btn btn-sm btn-outline-secondary" (click)="copy()">
        {{ copied() ? 'Copied' : 'Copy' }}
      </button>
    </div>
    <pre class="small bg-body-tertiary border rounded p-3 mb-0 overflow-auto"><code>{{ code() }}</code></pre>
  `,
})
export class CodeBlockComponent {
  readonly code = input.required<string>();
  readonly lang = input<string>('TS');

  protected readonly copied = signal(false);

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    } catch {
      // Clipboard not available (e.g. insecure context); the code can still be selected by hand.
    }
  }
}
