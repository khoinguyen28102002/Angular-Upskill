import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Task {
  id: number;
  title: string;
  done: boolean;
}
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './TaskList.html',
  styleUrls: ['./TaskList.css']
})

export class TaskList {
  tasks: Task[] = [
    { id: 1, title: 'Angular CLI and project anatomy: angular.json, main.ts, standalone bootstrap', done: false },
    { id: 2, title: 'Component anatomy and lifecycle hooks: ngOnInit, ngOnChanges, ngOnDestroy', done: true },
    { id: 3, title: 'Data binding: interpolation, property binding, event binding, two-way binding', done: false },
    { id: 4, title: 'Structural directives and the newer @if / @for / @switch control-flow syntax', done: false },
    { id: 5, title: 'Scaffold a "Task Tracker" app skeleton with 3 components', done: true },
  ];

  toggleDone(t: Task) {
    t.done = !t.done;
  }
}
