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
        path: 'tasks',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./page/task-management/task-management').then(m => m.TaskManagementPage),
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./component/TaskList/TaskList').then(m => m.TaskList),
            },
            {
                path: 'new',
                loadComponent: () =>
                    import('./component/TaskForm/TaskForm').then(m => m.TaskForm),
            },            
            {
                path: ':id',
                loadComponent: () =>
                    import('./component/task-detail/task-detail').then(m => m.TaskDetail),
                resolve: {
                    taskInfo: taskResolver,
                }
            },
            {
                path: ':id/edit',
                loadComponent: () =>
                    import('./component/TaskForm/TaskForm').then(m => m.TaskForm),
                resolve: {
                    taskInfo: taskResolver,
                }
            }
        ]
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
