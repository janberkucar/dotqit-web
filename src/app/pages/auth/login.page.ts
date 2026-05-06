/** Core Imports */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
/** Service Imports */
import { LanguageService } from '../../core/language/language.service';
import { AuthService } from '../../core/services/auth.service';
/** Type Imports */
import { LanguageKey } from '../../core/language/language.types';
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly supportedLanguages = this.languageService.supportedLanguages();

  submit(): void {
    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.auth
      .login({
        email: this.email,
        password: this.password,
      })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (response) => {
          this.successMessage.set(
            `Welcome ${response.user.name}. Token: ${response.accessToken}`,
          );
          void this.router.navigateByUrl('/state-demo');
        },
        error: (error: Error) => {
          this.errorMessage.set(error.message);
        },
      });
  }

  setLanguage(code: string): void {
    this.languageService.setLanguage(code as LanguageKey);
  }

  text(key: string): string {
    return this.languageService.t(key);
  }
}
