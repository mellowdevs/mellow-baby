import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the token from local storage
  const token = localStorage.getItem('mellow_token');

  // If a token exists, clone the request and add the Authorization header.
  if (token) {
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    // Pass the cloned request to the next handler.
    return next(clonedRequest);
  }
  // If no token exists, pass the original request along without modification.
  return next(req);
};
