import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../task.model';
import { TimeAgoPipe } from '../../pipe/time-ago.pipe';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [TimeAgoPipe],
  templateUrl: './TaskItem.html',
  styleUrls: ['./TaskItem.css']
})
export class TaskItem {
  @Input({ required: true }) task!: Task;
  @Output() toggle = new EventEmitter<number>();
}
