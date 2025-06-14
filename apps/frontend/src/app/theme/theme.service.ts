// apps/frontend/src/app/core/auth/theme.service.ts
// (I assume you placed it in core/auth, adjust the path if needed)

import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Manages the application's visual theme (light/dark mode).
 * It persists the user's choice in localStorage and applies the corresponding
 * CSS class to the root <html> element.
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  /** The CSS class applied to the <html> element for dark mode. */
  private readonly DARK_THEME_CLASS = 'mellow-baby-dark';

  /** The key used to store the theme preference in localStorage. */
  private readonly LOCAL_STORAGE_KEY = 'theme-dark';

  /**
   * The internal state of the theme.
   * A BehaviorSubject holds the current value and emits it to subscribers.
   * @private
   */
  private _isDark$: BehaviorSubject<boolean>;

  /**
   * Publicly exposed observable for components to subscribe to theme changes.
   * Components can reactively update their styles based on this stream.
   */
  public isThemeDark$: Observable<boolean>;

  private renderer: Renderer2;

  /**
   * Initializes the service.
   * - Creates the renderer to safely manipulate the DOM.
   * - Reads the initial theme state from localStorage.
   * - Subscribes to its own state to apply changes whenever the theme is toggled.
   * @param rendererFactory - Factory to create a Renderer2 instance.
   */
  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    const isDark = localStorage.getItem(this.LOCAL_STORAGE_KEY) === 'true';
    this._isDark$ = new BehaviorSubject<boolean>(isDark);
    this.isThemeDark$ = this._isDark$.asObservable();

    // React to changes in the theme state
    this.isThemeDark$.subscribe((isDark) => {
      this.applyTheme(isDark);
      localStorage.setItem(this.LOCAL_STORAGE_KEY, `${isDark}`);
    });
  }

  /**
   * Toggles the current theme between light and dark.
   */
  public toggleTheme(): void {
    // The only job of this method is to update the state.
    // The subscription in the constructor will handle the rest.
    this._isDark$.next(!this._isDark$.value);
  }

  /**
   * Applies the correct theme class to the root <html> element.
   * @param isDark - Whether the dark theme should be applied.
   * @private
   */
  private applyTheme(isDark: boolean): void {
    const htmlElement = document.documentElement;
    if (isDark) {
      this.renderer.addClass(htmlElement, this.DARK_THEME_CLASS);
    } else {
      this.renderer.removeClass(htmlElement, this.DARK_THEME_CLASS);
    }
  }
}
