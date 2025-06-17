import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { ButtonModule } from 'primeng/button';
import { LogoComponent } from '../../shared/components/logo/logo.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoModule, ButtonModule, LogoComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {}
