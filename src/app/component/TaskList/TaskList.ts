import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TaskItem } from '../TaskItem/TaskItem';
import { Task } from '../task.model';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskItem],
  templateUrl: './TaskList.html',
  styleUrls: ['./TaskList.css']
})
export class TaskList {
  private readonly taskService = inject(TaskService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  
  @Input() disabled = false;
  @Output() toggle = new EventEmitter<number>();
  @Output() taskSelected = new EventEmitter<number>();

  tasks: Task[] = [];
  isLoading = true;
  isSavingChanges = false;
  errorMessage = '';

  ngOnInit(){
    this.loadTasks();
  }
  createTask(): void{
    this.router.navigate(['tasks/new']);
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

  onToggle(taskId: number): void {
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
  
  onClick(taskId: number): void {
    this.router.navigate([`tasks/${taskId}`]);
  }

  private setError(error: unknown): void {
    this.errorMessage = error instanceof HttpErrorResponse
      ? error.status === 0
        ? 'Unable to reach the task server. Make sure the API is running on port 3000.'
        : `The task request failed (HTTP ${error.status}).`
      : 'An unexpected error occurred while communicating with the task server.';
  }

}
