import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CanLeave } from '../../guards/unsaved-changes.guard';
import { TaskService } from '../../services/task.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { forbiddenWordValidator } from '../../ulti/forbiddenWordValidator.util';
import { SelectModule } from 'primeng/select';
@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ButtonModule, SelectModule],
  templateUrl: './TaskForm.html',
  styleUrls: ['./TaskForm.css']
})
export class TaskForm implements CanLeave {
  private readonly taskService = inject(TaskService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditForm = false;
  isDirty = false;
  isInvalidForm = true;
  isSavingChanges = false;

  errorMessage = '';
  taskForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
        forbiddenWordValidator('test')
      ]
    }),
    status: new FormControl('', {
      nonNullable: true,
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.maxLength(500)
      ]
    })
  });
  statusOptions = [
    { label: 'To Do', value: 'to-do' },
    { label: 'Blocked', value: 'blocked' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' }
  ];

  ngOnInit() {
    this.taskForm.valueChanges.subscribe(() => {
      this.isDirty = true;
      this.isInvalidForm = !this.taskForm.valid;
    })
    this.route.paramMap.subscribe(params => {
      const taskId = params.get('id');
      if (taskId) {
        this.isEditForm = true;
        // Fetch the task details and populate the form
      }
    });
  }
  
  get title(){
    return this.taskForm.controls.title;
  }

  get description(){
    return this.taskForm.controls.description;
  }

  hasUnsavedChanges(): boolean {
    return this.isDirty;
  }

  resetForm(): void {
    this.taskForm.setValue({title: '', status: '', description: ''});
  }

  fillExample(): void {
    this.taskForm.patchValue({title: 'Learn Reactive Forms', status: 'to-do', description: 'Learn how to use Angular Reactive Forms.'});
  }

  submit(): void {
    const title = this.taskForm.controls.title.value?.trim();
    if (!title) return;
    this.isDirty = false;
    // this.create.emit(title);
    const trimmedTitle = title.trim();
    if (!trimmedTitle || this.isSavingChanges) return;

    this.isSavingChanges = true;
    this.errorMessage = '';
    this.taskService.createTask({
      title: trimmedTitle,
      done: this.taskForm.controls.status.value === 'completed',
      status: (this.taskForm.controls.status.value) as 'to-do' | 'blocked' | 'in-progress' | 'completed',
      description: this.taskForm.controls.description.value?.trim() || undefined,
      createdAt: new Date().toISOString()
    })
      .pipe(finalize(() => {
        this.isSavingChanges = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: () => {
          this.router.navigate(['/task-list']);
        },
        error: (error: HttpErrorResponse) => this.setError(error)
      });
  }

  onCancel(): void{
    this.router.navigate(['/task-list']);
  }
  private setError(error: unknown): void {
    this.errorMessage = error instanceof HttpErrorResponse
      ? error.status === 0
        ? 'Unable to reach the task server. Make sure the API is running on port 3000.'
        : `The task request failed (HTTP ${error.status}).`
      : 'An unexpected error occurred while communicating with the task server.';
  }
}
