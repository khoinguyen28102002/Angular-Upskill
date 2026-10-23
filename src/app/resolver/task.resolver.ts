import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../component/task.model';

export const taskResolver: ResolveFn<Task> = (route) => {
  const taskService = inject(TaskService);

  const id = route.paramMap.get('id')!;
  console.log('Resolver id:', id);

  return taskService.getTaskById(id);
};