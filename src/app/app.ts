import { Component, signal } from '@angular/core';
import { TaskForm } from './component/TaskForm/TaskForm';
import { TaskList } from './component/TaskList/TaskList';
import { TaskItem } from './component/TaskItem/TaskItem';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [TaskForm, TaskList, TaskItem],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('task-tracker');
}
