import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { TaskList } from '../../component/TaskList/TaskList';
import { Task } from '../../component/task.model';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-task-list-page',
  imports: [TaskList],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskListPage {  
  private readonly taskService = inject(TaskService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private route = inject(ActivatedRoute);

  tasks: Task[] = [];
  isFormVisible = false;
  isLoading = true;
  isSavingChanges = false;
  errorMessage = '';

  ngOnInit(){
    this.loadTasks();
  }
  
  createTask(): void{
    this.router.navigate(['create-task']);
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

  // createTask(title: string): void {
  //   const trimmedTitle = title.trim();
  //   if (!trimmedTitle || this.isSavingChanges) return;

  //   this.isSavingChanges = true;
  //   this.errorMessage = '';
  //   this.taskService.createTask({
  //     title: trimmedTitle,
  //     done: false,
  //     createdAt: new Date().toISOString()
  //   })
  //     .pipe(finalize(() => {
  //       this.isSavingChanges = false;
  //       this.changeDetector.markForCheck();
  //     }))
  //     .subscribe({
  //       next: (task) => {
  //         this.tasks = [...this.tasks, task];
  //         this.isFormVisible = false;
  //       },
  //       error: (error: HttpErrorResponse) => this.setError(error)
  //     });
  // }

  toggleTask(taskId: number): void {
    console.log('Task Id', taskId);
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

  goToDetail(taskId: number): void{
    this.router.navigate([`task-list/${taskId}`]);
  }

  private setError(error: unknown): void {
    this.errorMessage = error instanceof HttpErrorResponse
      ? error.status === 0
        ? 'Unable to reach the task server. Make sure the API is running on port 3000.'
        : `The task request failed (HTTP ${error.status}).`
      : 'An unexpected error occurred while communicating with the task server.';
  }
}
