import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './TaskForm.html',
  styleUrls: ['./TaskForm.css']
})
export class TaskForm {}
