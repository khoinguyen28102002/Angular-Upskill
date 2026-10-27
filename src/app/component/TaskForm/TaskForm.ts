import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CanLeave } from '../../guards/unsaved-changes.guard';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ButtonModule, FormsModule, InputTextModule],
  templateUrl: './TaskForm.html',
  styleUrls: ['./TaskForm.css']
})
export class TaskForm implements CanLeave {
  private readonly router = inject(Router);
  private readonly taskService = inject(TaskService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  @Output() create = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();
  title = '';
  isDirty = false;
  isSavingChanges = false;
  errorMessage = '';

  onTitleChange(){
    this.isDirty = true;
  }

  hasUnsavedChanges(): boolean {
    return this.isDirty;
  }
  
  submit(): void {
    const trimmedTitle = this.title.trim();
    if (!trimmedTitle || this.isSavingChanges) return;
    this.isDirty = false;

    this.isSavingChanges = true;
    this.errorMessage = '';
    this.taskService.createTask({
      title: trimmedTitle,
      done: false,
      createdAt: new Date().toISOString()
    })
      .pipe(finalize(() => {
        this.isSavingChanges = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: () => {
          this.router.navigate(['tasks']);
        },
        error: (error: HttpErrorResponse) => this.setError(error)
      });
  }

  onCancel(): void{
    this.router.navigate(['tasks']);
  }
  
  private setError(error: unknown): void {
    this.errorMessage = error instanceof HttpErrorResponse
      ? error.status === 0
        ? 'Unable to reach the task server. Make sure the API is running on port 3000.'
        : `The task request failed (HTTP ${error.status}).`
      : 'An unexpected error occurred while communicating with the task server.';
  }
}
