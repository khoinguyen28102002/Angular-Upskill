import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ButtonModule, SelectModule],
  templateUrl: './TaskForm.html',
  styleUrls: ['./TaskForm.css']
})
export class TaskForm {
  private readonly taskService = inject(TaskService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditForm = false;
  isInvalidForm = true;
  isSavingChanges = false;

  errorMessage = '';
  taskId: number | null = null;
  taskForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
    }),
    status: new FormControl('', {
      nonNullable: true,
    }),
    description: new FormControl('', {
      nonNullable: true,
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
      this.isInvalidForm = !this.taskForm.valid;
    })
    this.route.paramMap.subscribe(params => {
      const taskId = params.get('id');
      console.log('Task Id from route:', taskId);
      if (taskId) {
        this.isEditForm = true;
        this.taskId = Number(taskId);
        // Fetch the task details and populate the form
        this.taskService.getTaskById(taskId)
          .pipe(finalize(() => {
            this.changeDetector.markForCheck();
          }))
          .subscribe({
            next: (task) => {
              this.taskForm.setValue({
                title: task.title,
                status: task.status || 'to-do',
                description: task.description || ''
              });
            },
            error: (error: HttpErrorResponse) => this.setError(error)
          });
      }
    });
  }
  
  get title(){
    return this.taskForm.controls.title;
  }

  get description(){
    return this.taskForm.controls.description;
  }

  resetForm(): void {
    this.taskForm.setValue({title: '', status: '', description: ''});
  }

  fillExample(): void {
    this.taskForm.patchValue({title: 'Learn Reactive Forms', status: 'to-do', description: 'Learn how to use Angular Reactive Forms.'});
  }

  createTask(): void {
    const formControl = this.taskForm.controls;

    const title = formControl.title.value?.trim();
    if (!title) return;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    this.taskService.createTask({
      title: trimmedTitle,
      done: formControl.status.value === 'completed',
      status: (formControl.status.value) as 'to-do' | 'blocked' | 'in-progress' | 'completed',
      description: formControl.description.value?.trim() || undefined,
      createdAt: new Date().toISOString()
    })
      .pipe(finalize(() => {
        this.isSavingChanges = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error: HttpErrorResponse) => this.setError(error)
      });
  }

  editTask(): void {
    const formControl = this.taskForm.controls;

    const title = formControl.title.value?.trim();
    if (!title) return;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    this.taskService.updateTask({
      id: this.taskId!,
      title: trimmedTitle,
      done: formControl.status.value === 'completed',
      status: (formControl.status.value) as 'to-do' | 'blocked' | 'in-progress' | 'completed',
      description: formControl.description.value?.trim() || undefined,
      createdAt: new Date().toISOString()
    })
      .pipe(finalize(() => {
        this.isSavingChanges = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error: HttpErrorResponse) => this.setError(error)
      });
  }

  submit(): void {
    if (this.isSavingChanges) return;

    this.isSavingChanges = true;
    this.errorMessage = '';
    if (this.isEditForm) {
      this.editTask();
    } else {
      this.createTask();
    }
  }

  onCancel(): void{
    this.router.navigate(['/tasks']);
  }
  private setError(error: unknown): void {
    this.errorMessage = error instanceof HttpErrorResponse
      ? error.status === 0
        ? 'Unable to reach the task server. Make sure the API is running on port 3000.'
        : `The task request failed (HTTP ${error.status}).`
      : 'An unexpected error occurred while communicating with the task server.';
  }
}
