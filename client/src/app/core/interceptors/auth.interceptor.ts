import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const supabaseService = inject(SupabaseService);

  return from(supabaseService.getSession()).pipe(
    switchMap(session => {
      if (session?.access_token) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        return next(authReq);
      }
      return next(req);
    })
  );
};
