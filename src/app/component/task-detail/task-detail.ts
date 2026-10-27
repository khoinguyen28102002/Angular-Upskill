import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../task.model';
import { TaskStatusPipe } from '../../pipe/task-status.pipe';
import { TimeAgoPipe } from '../../pipe/time-ago.pipe';
import { ButtonModule } from 'primeng/button';
import { ArrowLeft } from '@primeicons/angular/arrow-left';

@Component({
  selector: 'app-task-detail',
  imports: [ButtonModule, ArrowLeft, TaskStatusPipe, TimeAgoPipe],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  taskInfo: Task = this.route.snapshot.data['taskInfo'];

  backToList(){
    this.router.navigate(['/tasks'])
  }
}
