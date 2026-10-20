import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { TaskForm } from './component/TaskForm/TaskForm';
import { TaskList } from './component/TaskList/TaskList';
import { Task } from './component/task.model';
import { AuthService } from './services/auth.service';
import { TaskService } from './services/task.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [TaskForm, TaskList],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly taskService = inject(TaskService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  isLoggedIn = false;
  tasks: Task[] = [];
  isFormVisible = false;
  isLoading = true;
  isSavingChanges = false;
  errorMessage = '';

  login(): void {
    this.authService.login();
    this.isLoggedIn = true;
    this.loadTasks();
  }

  showCreateForm(): void{
    this.isFormVisible = true;
  }

  cancelForm(): void {
    this.isFormVisible = false;
  }

  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.taskService.getTasks()
      .pipe(finalize(() => {
        this.isLoading = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: (tasks) => this.tasks = tasks,
        error: (error: HttpErrorResponse) => this.setError(error)
      });
  }

  createTask(title: string): void {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || this.isSavingChanges) return;

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
        next: (task) => {
          this.tasks = [...this.tasks, task];
          this.isFormVisible = false;
        },
        error: (error: HttpErrorResponse) => this.setError(error)
      });
  }

  toggleTask(taskId: number): void {
    if (this.isSavingChanges) return;

    const task = this.tasks.find(({ id }) => id === taskId);
    if (!task) return;

    this.isSavingChanges = true;
    this.errorMessage = '';
    this.taskService.updateTask({ ...task, done: !task.done })
      .pipe(finalize(() => {
        this.isSavingChanges = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: (updatedTask) => {
          this.tasks = this.tasks.map((current) =>
            current.id === taskId ? updatedTask : current
          );
        },
        error: (error: HttpErrorResponse) => this.setError(error)
      });
  }

  private setError(error: unknown): void {
    this.errorMessage = error instanceof HttpErrorResponse
      ? error.status === 0
        ? 'Unable to reach the task server. Make sure the API is running on port 3000.'
        : `The task request failed (HTTP ${error.status}).`
      : 'An unexpected error occurred while communicating with the task server.';
  }
}
