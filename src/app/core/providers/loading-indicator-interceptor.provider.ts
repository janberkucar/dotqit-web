import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { HttpLoadingService } from '../services/http-loading.service';

export const loadingIndicatorInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(HttpLoadingService);
  loading.begin();
  return next(req).pipe(finalize(() => loading.end()));
};
