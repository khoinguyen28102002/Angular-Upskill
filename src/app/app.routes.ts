import { Routes } from '@angular/router';
import { Login } from './page/login/login';
import { TaskManagementPage } from './page/task-management/task-management';
import { TaskList } from './component/TaskList/TaskList';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';

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
                component: TaskList, 
            },
            {
                path: 'new',
                canDeactivate: [unsavedChangesGuard],
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
                canDeactivate: [unsavedChangesGuard],
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
