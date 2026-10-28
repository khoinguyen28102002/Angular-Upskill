import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../task.model';
import { TaskStatusPipe } from '../../pipe/task-status.pipe';
import { TimeAgoPipe } from '../../pipe/time-ago.pipe';
import { ButtonModule } from 'primeng/button';
import { TaskService } from '../../services/task.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-task-detail',
  imports: [ButtonModule, TaskStatusPipe, TimeAgoPipe],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail {
  private readonly taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private changeDetector = inject(ChangeDetectorRef);

  taskInfo: Task = {
    id: 0,
    title: '',
    done: false,
    createdAt: new Date().toISOString(),
    status: 'to-do',
  };

  ngOnInit() {
    const taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.taskService.getTaskById(taskId)
      .pipe(
        finalize(() => {
          this.changeDetector.markForCheck();
        })
      )
      .subscribe({
        next: (task) => {
          this.taskInfo = task;
          console.log('Task Info:', this.taskInfo);
        },
        error: (error) => console.error('Error fetching task:', error)
      });
  }

  backToList(){
    this.router.navigate(['/tasks'])
  }

  onEditTask() {
    this.router.navigate([`/tasks/${this.taskInfo.id}/edit`]);
  }
}
