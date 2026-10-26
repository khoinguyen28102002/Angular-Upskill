import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../component/task.model';

// Resolver 1: Get task by ID
export const taskResolver: ResolveFn<Task> = (route) => {
  const taskService = inject(TaskService);
  const id = Number(route.paramMap.get('id'));

  return taskService.getTaskById(id);
};

// Resolver 2: Get all tasks
export const tasksResolver: ResolveFn<Task[]> = () => {
  const taskService = inject(TaskService);
  return taskService.getTasks();
};