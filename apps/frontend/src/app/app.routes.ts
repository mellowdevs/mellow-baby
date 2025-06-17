import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { loginRedirectGuard } from './auth/login-redirect.guard';
import { MainLayoutComponent } from './shared/components/layout/main-layout/main-layout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginRedirectGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [loginRedirectGuard] },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },

      // Add a default route to redirect to the dashboard
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      // Wildcard route FOR LOGGED-IN USERS. Must be the last child.
      // This will show the NotFoundComponent inside the main layout with the sidebar.
      { path: '**', component: NotFoundComponent },
    ],
  },
];
