import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskItem } from '../TaskItem/TaskItem';
import { Task } from '../task.model';
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskItem],
  templateUrl: './TaskList.html',
  styleUrls: ['./TaskList.css']
})
export class TaskList {
  @Input({ required: true }) tasks: Task[] = [];
  @Output() toggle = new EventEmitter<number>();

  onToggle(taskId: number): void {
    this.toggle.emit(taskId);
  }
}
