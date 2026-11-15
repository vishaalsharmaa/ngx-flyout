import { ChangeDetectionStrategy, Component, output } from '@angular/core';

export interface UserFormValue {
  name: string;
  email: string;
}

/** A plain form with its own Save / Cancel buttons, used inside a flyout with `showFooter="false"`. */
@Component({
  selector: 'app-user-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form (submit)="onSubmit($event, name.value, email.value)">
      <div class="mb-3">
        <label class="form-label" for="user-name">Name</label>
        <input #name id="user-name" class="form-control" value="Vishal Sharma" required />
      </div>
      <div class="mb-4">
        <label class="form-label" for="user-email">Email</label>
        <input #email id="user-email" type="email" class="form-control" placeholder="you@example.com" />
      </div>
      <div class="d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-outline-secondary" (click)="cancelled.emit()">Cancel</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
  `,
})
export class UserFormComponent {
  readonly saved = output<UserFormValue>();
  readonly cancelled = output<void>();

  protected onSubmit(event: Event, name: string, email: string): void {
    event.preventDefault();
    this.saved.emit({ name, email });
  }
}
