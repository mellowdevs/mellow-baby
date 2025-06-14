import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { FormItem } from '../../shared/models/form-item.model';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DynamicFormComponent } from '../../shared/components/dynamic-form/dynamic-form.component';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterLink } from '@angular/router';

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
  private authService = inject(AuthService);

  registerForm: FormGroup;
  registerFormItems: FormItem[] = [];

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.registerFormItems = [
      {
        controlName: 'name',
        label: 'registerPage.nameLabel',
        type: 'text',
        id: 'register-name',
      },
      {
        controlName: 'email',
        label: 'registerPage.emailLabel',
        type: 'email',
        id: 'register-email',
      },
      {
        controlName: 'password',
        label: 'registerPage.passwordLabel',
        type: 'password',
        id: 'register-password',
      },
    ];
  }

  onSubmit(): void {
    this.authService.register(this.registerForm.value).subscribe({
      next: (resp) => {
        console.log('success');
      },
      error: (err) => console.error(err),
    });
  }
}
