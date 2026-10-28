import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { TaskList } from '../../component/TaskList/TaskList';
import { Task } from '../../component/task.model';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-task-management-page',
  imports: [RouterOutlet],
  templateUrl: './task-management.html',
  styleUrl: './task-management.css',
})
export class TaskManagementPage {  
  private readonly taskService = inject(TaskService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private route = inject(ActivatedRoute);

  onAddNewPage = false;

  ngOnInit(){
    this.onAddNewPage = false;
  }

  createTask(): void{
    this.onAddNewPage = true;
    this.router.navigate(['tasks/new']);
  }
}
