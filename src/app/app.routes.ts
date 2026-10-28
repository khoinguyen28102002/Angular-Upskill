import { Routes } from '@angular/router';
import { Login } from './page/login/login';
import { TaskManagementPage } from './page/task-management/task-management';
import { TaskList } from './component/TaskList/TaskList';

export const routes: Routes = [
    {
        path: 'login',
        component: Login,
    },
    {
        path: 'tasks',
        component: TaskManagementPage,
        children: [
            {
                path: '',
                // loadComponent: () =>
                //     import('./component/TaskList/TaskList').then(m => m.TaskList),
                component: TaskList, 
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
            },
            {
                path: ':id/edit',
                loadComponent: () =>
                    import('./component/TaskForm/TaskForm').then(m => m.TaskForm),
            },
        ],
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
