import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TaskItem } from '../TaskItem/TaskItem';
import { Task } from '../task.model';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';


type TaskFilter = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskItem, FormsModule, InputTextModule, ButtonModule],
  templateUrl: './TaskList.html',
  styleUrls: ['./TaskList.css']
})
export class TaskList {
  private readonly taskService = inject(TaskService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  tasks: Task[] = [];
  isFormVisible = false;
  isLoading = true;
  isSavingChanges = false;
  errorMessage = '';
  searchTerm = '';
  activeFilter: TaskFilter = 'all';

  get completedCount(): number {
    return this.tasks.filter(({ done }) => done).length;
  }

  get activeCount(): number {
    return this.tasks.length - this.completedCount;
  }

  get completionRate(): number {
    return this.tasks.length === 0 ? 0 : Math.round((this.completedCount / this.tasks.length) * 100);
  }

  get filteredTasks(): Task[] {
    const query = this.searchTerm.trim().toLocaleLowerCase();

    return this.tasks.filter((task) => {
      const matchesFilter = this.activeFilter === 'all'
        || (this.activeFilter === 'active' && !task.done)
        || (this.activeFilter === 'completed' && task.done);
      return matchesFilter && (!query || task.title.toLocaleLowerCase().includes(query));
    });
  }

  ngOnInit(){
    this.loadTasks();
  }

  setFilter(filter: TaskFilter): void {
    this.activeFilter = filter;
  }

  goToCreateTask(): void {
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
