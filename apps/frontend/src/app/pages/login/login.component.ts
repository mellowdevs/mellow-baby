import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DynamicFormComponent } from '../../shared/components/dynamic-form/dynamic-form.component';
import { FormItem } from '../../shared/models/form-item.model';
import { AuthService } from '../../core/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';

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
  private translocoService = inject(TranslocoService);
  private messageService = inject(MessageService);
  private router = inject(Router);

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
        component: 'input',
        validationMessages: {
          required: 'form.errors.required',
          email: 'form.errors.emailInvalid',
        },
      },
      {
        controlName: 'password',
        label: 'loginPage.passwordLabel',
        type: 'password',
        id: 'login-password',
        component: 'input',
        validationMessages: {
          required: 'form.errors.required',
        },
      },
    ];
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        const header = this.translocoService.translate('toast.error');
        const defaultErrorKey = 'form.errors.genericError';
        const msgKey = err.status === 401 ? 'form.errors.invalidCredentials' : defaultErrorKey;
        this.translocoService
          .selectTranslate(msgKey)
          .pipe(take(1))
          .subscribe((translatedMsg) => {
            this.messageService.add({ severity: 'error', summary: header, detail: translatedMsg });
          });
      },
    });
  }
}
