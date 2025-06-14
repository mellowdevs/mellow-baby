import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DynamicFormComponent } from '../../shared/components/dynamic-form/dynamic-form.component';
import { FormItem } from '../../shared/models/form-item.model';
import { AuthService } from '../../core/auth/auth.service';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DynamicFormComponent,
    RouterLink,
    TranslocoModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm: FormGroup;
  loginFormItems: FormItem[];

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.loginFormItems = [
      {
        controlName: 'email',
        label: 'loginPage.emailLabel',
        type: 'email',
        id: 'login-email',
      },
      {
        controlName: 'password',
        label: 'loginPage.passwordLabel',
        type: 'password',
        id: 'login-password',
      },
    ];
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.authService.login(this.loginForm.value).subscribe({
      next: (resp) => {
        console.log('success');
      },
      error: (err) => console.error(err),
    });
  }
}
