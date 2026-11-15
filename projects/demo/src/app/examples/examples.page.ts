import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FlyoutCancelReason, NgxFlyout, NgxFlyoutFooter, NgxFlyoutIcon } from 'ngx-flyout';
import { ExampleCardComponent } from './example-card.component';
import { EXAMPLE_CODE } from './example-code';
import { UserFormComponent, UserFormValue } from './user-form.component';

interface LogEntry {
  id: number;
  time: string;
  source: string;
  event: string;
}

@Component({
  selector: 'app-examples-page',
  imports: [NgxFlyout, NgxFlyoutIcon, NgxFlyoutFooter, ExampleCardComponent, UserFormComponent],
  templateUrl: './examples.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamplesPage {
  /** Static source shown in each example's Code tab. */
  protected readonly code = EXAMPLE_CODE;

  /** Example 2: state owned by the parent, bound with [(opened)]. */
  protected readonly settingsOpen = signal(false);

  /** Example 8: whether the flyout slides. */
  protected readonly slide = signal(true);

  /** Example 4: saving state for the async example. */
  protected readonly saving = signal(false);

  protected readonly log = signal<LogEntry[]>([]);
  private nextLogId = 0;

  protected record(source: string, event: string): void {
    const time = new Date().toLocaleTimeString();
    this.log.update((entries) => [{ id: this.nextLogId++, time, source, event }, ...entries].slice(0, 8));
  }

  protected onCancel(source: string, reason: FlyoutCancelReason): void {
    this.record(source, `cancel ('${reason}')`);
  }

  protected onUserSaved(value: UserFormValue, flyout: NgxFlyout): void {
    this.record('User form', `saved: ${value.name}`);
    flyout.close();
  }

  protected onUserCancelled(flyout: NgxFlyout): void {
    this.record('User form', 'form cancelled');
    flyout.close();
  }

  /** Example 4: keep the flyout open while "saving", then close it from code. */
  protected saveSlowly(flyout: NgxFlyout): void {
    this.record('Async save', 'confirm: saving…');
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.record('Async save', 'saved, closed with close()');
      flyout.close();
    }, 1500);
  }
}
