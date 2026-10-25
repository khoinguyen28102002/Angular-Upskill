import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CanLeave } from '../../guards/unsaved-changes.guard';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ButtonModule, FormsModule, InputTextModule],
  templateUrl: './TaskForm.html',
  styleUrls: ['./TaskForm.css']
})
export class TaskForm implements CanLeave {
  @Output() create = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();
  @Input() disabled = false;
  title = '';
  isDirty = false;

  onTitleChange(){
    this.isDirty = true;
  }

  hasUnsavedChanges(): boolean {
    return this.isDirty;
  }

  submit(): void {
    const title = this.title.trim();
    if (!title) return;
    this.isDirty = false;
    this.create.emit(title);
  }
  onCancel(): void{
    this.cancel.emit();
  }
}
