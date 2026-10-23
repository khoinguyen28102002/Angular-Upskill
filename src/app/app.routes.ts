import { Routes } from '@angular/router';
import { Login } from './page/login/login';
import { TaskListPage } from './page/task-list/task-list';
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
        component: TaskListPage,
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
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'login',
    }
];
