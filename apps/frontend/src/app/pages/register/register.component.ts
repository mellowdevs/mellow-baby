import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { FormItem } from '../../shared/models/form-item.model';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DynamicFormComponent } from '../../shared/components/dynamic-form/dynamic-form.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { RouterLink, Router } from '@angular/router';
import { take } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private translocoService = inject(TranslocoService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  registerFormItems: FormItem[] = [];

  constructor() {
    this.registerForm = this.fb.group({
      name: ['a', [Validators.required]],
      email: ['test@example.com', [Validators.required, Validators.email]],
      password: [
        'aaaAAA',
        [
          Validators.required,
          Validators.pattern(
            /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
          ),
        ],
      ],
    });

    this.registerFormItems = [
      {
        controlName: 'name',
        label: 'registerPage.nameLabel',
        type: 'text',
        validationMessages: {
          required: 'form.errors.required',
        },
      },
      {
        controlName: 'email',
        label: 'registerPage.emailLabel',
        type: 'email',
        validationMessages: {
          required: 'form.errors.required',
          email: 'form.errors.emailInvalid',
        },
      },
      {
        controlName: 'password',
        label: 'registerPage.passwordLabel',
        type: 'password',
        component: 'password',
        validationMessages: {
          required: 'form.errors.required',
          pattern: 'form.errors.passwordMessage',
        },
      },
    ];
  }

  onSubmit(): void {
    let header = '';
    let msgKey = '';
    this.authService.register(this.registerForm.value).subscribe({
      next: (resp) => {
        header = this.translocoService.translate('toast.success');
        msgKey = 'registerPage.successMessage';
        this.translocoService
          .selectTranslate(msgKey)
          .pipe(take(1))
          .subscribe((translatedMsg) => {
            this.messageService.add({
              severity: 'success',
              summary: header,
              detail: translatedMsg,
            });
            this.router.navigate(['/login']);
          });
      },
      error: (err) => {
        header = this.translocoService.translate('toast.error');
        const defaultErrorKey = 'form.errors.genericError';
        msgKey = err.status === 409 ? 'form.errors.emailTaken' : defaultErrorKey;
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
