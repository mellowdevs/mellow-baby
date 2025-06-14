import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ThemeService } from './theme/theme.service';
import { CommonModule } from '@angular/common';
import { TranslocoService } from '@ngneat/transloco';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ButtonModule, FormsModule, DropdownModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  // inject() is a modern and clean way to get services
  themeService = inject(ThemeService);
  translocoService = inject(TranslocoService);

  languages = [
    { name: 'English', code: 'en', flag: 'gb' },
    { name: 'Türkçe', code: 'tr', flag: 'tr' },
    { name: 'Deutsch', code: 'de', flag: 'de' },
  ];

  /**
   * changes between light and dark mode
   */
  toggleDarkMode() {
    this.themeService.toggleTheme();
  }

  /**
   * Changes the application's active language.
   * @param lang The language code to switch to (e.g., 'en', 'tr', 'de').
   */
  changeLang(lang: string) {
    this.translocoService.setActiveLang(lang);
    localStorage.setItem('lang', lang);
  }
}
