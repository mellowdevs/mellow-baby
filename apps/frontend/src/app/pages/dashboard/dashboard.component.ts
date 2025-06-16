import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private http = inject(HttpClient);

  testApiCall() {
    // This endpoint doesn't exist yet on the backend, so it will fail with a 404,
    // but that's okay. We just want to see the request headers.
    this.http.get('http://localhost:3000/auth/profile').subscribe();
  }
}
