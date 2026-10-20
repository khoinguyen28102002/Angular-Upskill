import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

const taskApiUrl = 'http://localhost:3000/tasks';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const isTaskApiRequest =
    request.url === taskApiUrl || request.url.startsWith(`${taskApiUrl}/`);
  const token = inject(AuthService).getToken();

  if (!isTaskApiRequest || !token) {
    return next(request);
  }

  return next(request.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  }));
};
