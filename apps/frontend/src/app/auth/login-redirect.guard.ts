import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';

export const loginRedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // User is logged in? What are they doing here?
    // Get 'em outta here! Redirect to the dashboard.
    router.navigate(['/']);
    return false;
  }
  // User is not logged in, so they are cleared to access login/register.
  // Let them pass!
  return true; // <-- Grant access to the route
};
