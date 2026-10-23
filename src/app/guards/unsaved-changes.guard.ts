import { CanDeactivateFn } from '@angular/router';

export interface CanLeave {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard:
  CanDeactivateFn<CanLeave> = (component) => {

  if (!component.hasUnsavedChanges()) {
    return true;
  }

  return confirm(
    'You have unsaved changes. Leave anyway?'
  );
};