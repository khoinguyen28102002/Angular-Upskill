import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { Task } from '../task.model';
import { TimeAgoPipe } from '../../pipe/time-ago.pipe';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CheckboxModule, FormsModule, TagModule, TimeAgoPipe],
  templateUrl: './TaskItem.html',
  styleUrls: ['./TaskItem.css']
})
export class TaskItem {
  @Input({ required: true }) task!: Task;
  @Input() disabled = false;
  @Output() toggle = new EventEmitter<number>();
  @Output() taskSelected = new EventEmitter<number>();
}
