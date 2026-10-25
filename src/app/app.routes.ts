import { Routes } from '@angular/router';
import { Login } from './page/login/login';
import { authGuard } from './guards/auth.guard';
import { taskResolver } from './resolver/task.resolver';

export const routes: Routes = [
    {
        path: 'login',
        component: Login,
    },
    {
        path: 'task-list',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./page/task-list/task-list').then(m => m.TaskListPage),
    },
    {
        path: 'task-list/:id',
        loadComponent: () =>
            import('./component/task-detail/task-detail').then(m => m.TaskDetail),
        resolve: {
            taskInfo: taskResolver,
        }
    },
    {
        path: 'task-list/create-new',
        loadComponent: () =>
            import('./component/TaskForm/TaskForm').then(m => m.TaskForm),
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'login',
    }
];
