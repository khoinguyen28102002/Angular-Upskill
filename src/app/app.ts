import { Component } from '@angular/core';
import { TaskForm } from './component/TaskForm/TaskForm';
import { TaskList } from './component/TaskList/TaskList';
import { Task } from './component/task.model';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [TaskForm, TaskList],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  tasks: Task[] = [
    { id: 1, title: 'Angular CLI and project anatomy: angular.json, main.ts, standalone bootstrap', done: false },
    { id: 2, title: 'Component anatomy and lifecycle hooks: ngOnInit, ngOnChanges, ngOnDestroy', done: true },
    { id: 3, title: 'Data binding: interpolation, property binding, event binding, two-way binding', done: false },
    { id: 4, title: 'Structural directives and the newer @if / @for / @switch control-flow syntax', done: false },
    { id: 5, title: 'Scaffold a "Task Tracker" app skeleton with 3 components', done: true },
  ];
  isFormVisible = false;

  private nextTaskId = 6;

  showCreateForm(): void{
    this.isFormVisible = true;
    console.log('Show form');
  }
  cancelForm(): void {
    this.isFormVisible = false;
  }

  createTask(title: string): void {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    this.tasks = [...this.tasks, { id: this.nextTaskId++, title: trimmedTitle, done: false }];
  }

  toggleTask(taskId: number): void {
    this.tasks = this.tasks.map((task) =>
      task.id === taskId ? { ...task, done: !task.done } : task
    );
  }
}
