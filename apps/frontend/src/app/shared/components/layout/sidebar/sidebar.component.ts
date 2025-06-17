import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../../theme/theme.service';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../../core/auth/auth.service';
import { LogoComponent } from '../../logo/logo.component';

interface Langugage {
  name: string;
  code: string;
  flag: string;
}
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    TranslocoModule,
    RouterLink,
    SplitButtonModule,
    SpeedDialModule,
    LogoComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  themeService = inject(ThemeService);
  public translocoService = inject(TranslocoService);
  public authService = inject(AuthService);
  public selectedLanguage: any = localStorage.getItem('lang') || 'en';
  languages: Langugage[] = [
    { name: 'English', code: 'en', flag: 'gb' },
    { name: 'Türkçe', code: 'tr', flag: 'tr' },
    { name: 'Deutsch', code: 'de', flag: 'de' },
  ];
  languageMenuItems: MenuItem[] = [];
  currentLanguage: Langugage =
    this.languages.find((lang) => lang.code === localStorage.getItem('lang')) || this.languages[0];

  ngOnInit() {
    this.translocoService.langChanges$.subscribe((activeLang) => {
      this.setCurrentLangugage(activeLang);
      this.buildLanguageMenuItems();
    });
  }

  toggleDarkMode() {
    this.themeService.toggleTheme();
  }

  setCurrentLangugage(langCode: string) {
    this.currentLanguage = this.languages.find((l) => l.code === langCode) || this.languages[0];
    localStorage.setItem('lang', langCode);
  }

  private buildLanguageMenuItems(): void {
    // Build the menu items array, excluding the currently active language
    this.languageMenuItems = this.languages
      .filter((l) => l.code !== this.currentLanguage.code)
      .map((l) => ({
        label: l.name,
        icon: `fi fi-${l.flag}`,
        command: () => this.changeLang(l.code),
      }));
  }

  changeLang(langCode: string): void {
    this.translocoService.setActiveLang(langCode);
  }

  logOut() {
    this.authService.logout();
  }
}
