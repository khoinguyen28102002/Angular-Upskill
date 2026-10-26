import { Routes } from '@angular/router';
import { Login } from './page/login/login';
import { TaskListPage } from './page/task-list/task-list';
import { authGuard } from './guards/auth.guard';
import { taskResolver, tasksResolver } from './resolver/task.resolver';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login,
    },
    {
        path: 'task-list',
        canActivate: [authGuard],
        component: TaskListPage,
        // resolve: {
        //     tasksInfo: tasksResolver,
        // }
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
        path: 'create-task',
        canDeactivate: [unsavedChangesGuard],
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
