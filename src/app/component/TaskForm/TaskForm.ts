import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './TaskForm.html',
  styleUrls: ['./TaskForm.css']
})
export class TaskForm {
  @Output() create = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();
  @Input() disabled = false;
  title = '';

  submit(): void {
    const title = this.title.trim();
    if (!title) return;

    this.create.emit(title);
  }
  onCancel(): void{
    this.cancel.emit();
  }
}
